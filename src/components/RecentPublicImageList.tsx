'use client'

import { actionGetPublicImages } from "@/actions/image";
import { Button, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import GalleryComponent, { IGallery } from "./Gallery";

async function getImages(limit?: number, last_image_id?: string) {
    return (await actionGetPublicImages(limit, last_image_id)).map(img => {
      return {
        _id: img._id.toString(),
        url: img.url,
        title: img.title,
        width: img.width,
        height: img.height
      }
    })
}

export default function RecentPublicImageList() {
    const [images, setImages] = useState<IGallery[]>([]);

    const getMoreImages = async (last_image_id: string) => {
        const newImages = await getImages(4, last_image_id)

        setImages(images => [...images, ...newImages])
    }

    useEffect(() => {
        const asyncFn = async () => {
            setImages(await getImages(4));
        }

        asyncFn();
    }, [])

    return (
        <>
            <Text size="xl" fw={700}>최근 업로드</Text>
            <GalleryComponent images={images} />
            <Button onClick={() => {getMoreImages(images[images.length - 1]._id)}}>더 보기</Button>
        </>
    )
}
