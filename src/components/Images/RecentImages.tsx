'use client'

import { useEffect, useState } from "react";
import GalleryComponent, { IGallery } from "../Gallery";
import { actionGetUserRecentImages } from "@/actions/image";

export default function RecentImages({ userId } : { userId: string }) {
    const [ images, setImages ] = useState<IGallery[]>([]);

    useEffect(() => {
        const asyncFn = async () => {
            const pics = await actionGetUserRecentImages(10, userId)

            const galleryImages: IGallery[] = pics.map(img => {
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
