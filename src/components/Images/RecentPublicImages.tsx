'use client'

import { useEffect, useState } from "react";
import GalleryComponent, { IGallery } from "../Gallery";
import { actionGetRecentPublicImages } from "@/actions/image";

export default function RecentPublicImages({ userId } : { userId: string }) {
    const [ images, setImages ] = useState<IGallery[]>([]);

    useEffect(() => {
        const asyncFn = async () => {
            const userPublicPics = await actionGetRecentPublicImages(10, userId)

            const galleryImages: IGallery[] = userPublicPics.map(img => {
                return {
                    _id: img._id.toString(),
                    url: img.url,
                    title: img.title,
                    width: img.width,
                    height: img.height
                }
            })

            setImages(galleryImages);
        }

        asyncFn()
    }, [])

    return (
        <GalleryComponent images={images} />
    )
}
