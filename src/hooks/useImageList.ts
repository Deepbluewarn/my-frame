import {
    actionGetNextImagesById,
    actionGetPrevImagesById,
    actionGetSurroundingImagesById
} from "@/actions/image";
import { ImageWithOwner } from "@/services/Image";
import { usePathname, notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface ImageWithOwnerPagination extends ImageWithOwner {
    prev?: string | null;
    next?: string | null;
}

type ImageListGeneric = Map<string, ImageWithOwnerPagination>;

export default function useImageList(initImages: ImageWithOwner[]) {
    // ImageDetails에서 이미지 Pagination을 구현하기 위한 Hook

    const use_pathname = usePathname();
    const [imageCache, setImageCache] = useState<ImageListGeneric>(new Map());
    const [currentImgId, setCurrentImgId] = useState(use_pathname.split('/')[2]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const pageImages = initImages.map((v, i) => {
            const pg = v as ImageWithOwnerPagination;

            pg.prev = i <= 0 ? null : initImages[i - 1].id;
            pg.next = i >= initImages.length - 1 ? null : initImages[i + 1].id

            return pg;
        })

        setImageCache(m => {
            const res = new Map(m);
            pageImages.forEach(e => {
                res.set(e.id, e);
            });
            return res;
        })
    }, [])

    useEffect(() => {
        setCurrentImgId(use_pathname.split('/')[2])
    }, [use_pathname])

    // App router Shallow Routing 구현
    // https://github.com/vercel/next.js/discussions/18072
    const updateHistory = (imageId: string) => {
        const url = `/image/${imageId}`
        window.history.replaceState({ ...window.history.state, as: url, url: url }, '', url);
        setCurrentImgId(imageId)
    }

    const current = imageCache.get(currentImgId);

    const next = async () => {
        setLoading(true);

        const currentImage = imageCache.get(currentImgId);
        const lastImgId = getLastImage()?.id;

        if (!currentImage) return;

        if (currentImage.next) {
            // setCurrentImgId(currentImage.next);
            updateHistory(currentImage.next)
        }

        if (!hasImagesWithinRadius(currentImage.id, true) && lastImgId) {
            await addNextImage(lastImgId)
        }
        setLoading(false);
    }

    const prev = async () => {
        setLoading(true);
        const currentImage = imageCache.get(currentImgId);
        const firstImgId = getFirstImage()?.id;

        if (!currentImage) return;

        if (currentImage.prev) {
            updateHistory(currentImage.prev)
        }
        if (!hasImagesWithinRadius(currentImage.id, false) && firstImgId) {
            await addPrevImage(firstImgId)
        }
        setLoading(false);
    }

    const list = (radius: number): (ImageWithOwnerPagination | undefined)[] => {
        const currentImage = imageCache.get(currentImgId);
        const res: (ImageWithOwnerPagination | undefined)[] = [];

        res.push(currentImage);

        let prevCursor = currentImage;
        for (let i = 0; i < radius; i++) {
            prevCursor = imageCache.get(prevCursor?.prev || '');
            res.unshift(prevCursor);
        }

        let nextCursor = currentImage;
        for (let i = 0; i < radius; i++) {
            nextCursor = imageCache.get(nextCursor?.next || '');
            res.push(nextCursor);
        }

        return res;
    };

    const addNextImage = async (lastImgId: string) => {
        const newImage = await actionGetNextImagesById(lastImgId, 1);

        if (!newImage || newImage.length <= 0) return;

        setImageCache(m => {
            const lastKey = Array.from(m.keys()).pop();
            const lastImage = m.get(lastKey!);
            const pgImage = newImage[0] as ImageWithOwnerPagination;
            const res = new Map(m);

            if (!lastImage) return m;

            lastImage.next = pgImage.id;
            pgImage.prev = lastImage.id;
            pgImage.next = null;

            res.set(lastImage.id, lastImage);
            res.set(pgImage.id, pgImage);

            return res;
        })

        return newImage;
    }

    const addPrevImage = async (firstImgId: string) => {
        const newImage = await actionGetPrevImagesById(firstImgId, 1);

        if (!newImage || newImage.length <= 0) return;

        setImageCache(m => {


            const firstKey = Array.from(m.keys()).sort()[0];
            const firstImage = m.get(firstKey!);
            const pgImage = newImage[0] as ImageWithOwnerPagination;
            const res = new Map(m);

            if (!firstImage) return m;

            firstImage.prev = pgImage.id;
            pgImage.prev = null;
            pgImage.next = firstImage.id;

            res.set(pgImage.id, pgImage);
            res.set(firstImage.id, firstImage);

            return res;
        })

        return newImage;
    }

    // 

    const hasImagesWithinRadius = (id: string, next?: boolean): boolean => {
        let cursor = imageCache.get(id);
        let count = 0;

        while (cursor && count <= 2) {
            const target = next ? cursor.next : cursor.prev
            if (target) {
                cursor = imageCache.get(target);
                count++;
            } else {
                break;
            }
        }

        return !(count <= 2);
    };

    const getLastImage = () => {
        const lastKey = Array.from(imageCache.keys()).sort().pop();
        return imageCache.get(lastKey!);
    }

    const getFirstImage = () => {
        const firstKey = Array.from(imageCache.keys()).sort()[0];
        return imageCache.get(firstKey!);
    }

    return {
        next, prev, list, current, loading,
    }
}