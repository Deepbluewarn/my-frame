import {
    actionAddImageComment,
    actionAddImageStar,
    actionAddImageTags,
    actionGetImageComments,
    actionGetImageStarList,
    actionGetNextImagesById,
    actionGetPrevImagesById,
    actionRemoveImageComment,
    actionRemoveImageStar,
    actionRemoveImageTag,
    actionUpdateImageTitleAndDescription,
} from "@/actions/image";
import { IComment } from "@/db/models/Image";
import { IUserInfo } from "@/db/models/User";
import { ImageWithOwner } from "@/services/Image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface ImageWithOwnerPagination extends ImageWithOwner {
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
    const [comment, setComment] = useState<IComment[]>([]);
    const [starList, setStarList] = useState<IUserInfo[]>([]);

    const current = imageCache.get(currentImgId);

    useEffect(() => {
        const pageImages = initImages.map((v, i) => {
            const pg = v as ImageWithOwnerPagination;

            pg.prev = i <= 0 ? null : initImages[i - 1]._id;
            pg.next = i >= initImages.length - 1 ? null : initImages[i + 1]._id

            return pg;
        })

        setImageCache(m => {
            const res = new Map(m);
            pageImages.forEach(e => {
                res.set(e._id, e);
            });
            return res;
        })
    }, [])

    useEffect(() => {
        actionGetImageComments(currentImgId).then(comment => {
            setComment(comment ?? []);
        })

        actionGetImageStarList(currentImgId).then(list => {
            console.log(list)
            setStarList(list);
        })
    }, [currentImgId])

    useEffect(() => {
        const newImgId = use_pathname.split('/')[2]

        if (newImgId !== currentImgId) {
            setCurrentImgId(newImgId);
        }
        
    }, [use_pathname])

    const updateHistory = (imageId: string) => {
        const url = `/image/${imageId}`
        window.history.pushState(null, '', url)
    }


    const next = async () => {
        setLoading(true);

        const currentImage = imageCache.get(currentImgId);
        const lastImgId = getLastImage()?._id;

        if (!currentImage) return;

        if (currentImage.next) {
            updateHistory(currentImage.next)
        }

        if (!hasImagesWithinRadius(currentImage._id, true) && lastImgId) {
            await addNextImage(lastImgId)
        }
        setLoading(false);
    }

    const prev = async () => {
        setLoading(true);
        const currentImage = imageCache.get(currentImgId);
        const firstImgId = getFirstImage()?._id;

        if (!currentImage) return;

        if (currentImage.prev) {
            updateHistory(currentImage.prev)
        }
        if (!hasImagesWithinRadius(currentImage._id, false) && firstImgId) {
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

    const addTags = async (tagStr: string) => {
        const tags = tagStr.split(' ');

        actionAddImageTags(currentImgId, tags).then(() => {
            setImageCache(m => {
                const res = new Map(m);
                const image = res.get(currentImgId);
    
                if (image) {
                    image.tags = Array.from(new Set([...image.tags, ...tags]))
                    res.set(currentImgId, image);
                }
    
                return res;
            })
        })
    }

    const removeTags = (targetTag: string) => {
        actionRemoveImageTag(currentImgId, targetTag).then(() => {
            setImageCache(m => {
                const res = new Map(m);
                const image = res.get(currentImgId);
    
                if (image) {
                    image.tags = image.tags.filter(v => v !== targetTag)
                }
    
                return res;
            })
        })
    }

    const addComment = (comment: string) => {
        actionAddImageComment(currentImgId, comment).then((addedComment) => {
            console.log('useImageList addComment addedComment: ', addedComment)
            setComment(comments => {
                return [...comments, addedComment]
            })
        })
    }

    const removeComment = async (commentId: string) => {
        const res = await actionRemoveImageComment(currentImgId, commentId);

        if (res) {
            setComment(comments => {
                return comments.filter(c => c._id !== commentId)
            })
        }
    }

    const addStar = async (userSub?: string | null) => {
        console.log('useImageList addStar userSub: ', userSub);

        if (!userSub) return;

        const res = await actionAddImageStar(currentImgId, userSub);

        if (res) {
            console.log(`userSub: ${userSub}가 이미지에 좋아요를 추가했습니다.`)
            setStarList(list => [...list, res])
        }
    }
    const removeStar = async (userSub?: string | null) => {
        console.log('useImageList removeStar userSub: ', userSub);

        if (!userSub) return;

        const res = await actionRemoveImageStar(currentImgId, userSub);

        if (res) {
            console.log(`userSub: ${userSub}가 이미지에 좋아요를 취소했습니다.`)
            setStarList(list => list.filter(l => l.sub !== res.sub))
        }
    }

    const updateImageTitleAndDescription = async (new_title: string, new_description: string) => {
        const update = await actionUpdateImageTitleAndDescription(currentImgId, new_title, new_description)

        if (!update) {
            throw new Error('사진 정보 업데이트에 실패했습니다.')
        }

        setImageCache(c => {
            const newCache = new Map(c);

            const image = newCache.get(currentImgId)

            if (!image) return c;

            image.title = update?.title || image.title;
            image.description = update?.description || image.description;

            return newCache;
        });
    }

    const addNextImage = async (lastImgId: string) => {
        const newImage = await actionGetNextImagesById(lastImgId, 1);

        if (!newImage || newImage.length <= 0) return;

        setImageCache(m => {
            const lastKey = Array.from(m.keys()).sort()[m.size - 1];
            const lastImage = m.get(lastKey!);
            const pgImage = newImage[0] as ImageWithOwnerPagination;
            const res = new Map(m);

            if (!lastImage) return m;

            lastImage.next = pgImage._id;
            pgImage.prev = lastImage._id;
            pgImage.next = null;

            res.set(lastImage._id, lastImage);
            res.set(pgImage._id, pgImage);

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

            firstImage.prev = pgImage._id;
            pgImage.prev = null;
            pgImage.next = firstImage._id;

            res.set(pgImage._id, pgImage);
            res.set(firstImage._id, firstImage);

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
        addTags, removeTags,
        addComment, removeComment, comment,
        addStar, removeStar, starList,
        updateImageTitleAndDescription, 
    }
}