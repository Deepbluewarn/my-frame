'use client'

import { Box } from "@mantine/core";
import Styles from '@/styles/components/Gallery.module.css';
import Link from "next/link";
import Image from "next/image";

export interface IGallery {
    _id: string;
    url: string;
    title: string;
    width: number;
    height: number;
}

export default function GalleryComponent({ images }: { images?: IGallery[] }) {

    return (
        <Box className={Styles.container}>
            {images?.map((image, index) => (
                <Box
                    key={index}
                    style={{ '--w': image.width, '--h': image.height }}
                    className={Styles.image_wrapper}
                >
                    <Link href={`/image/${image._id}`}>
                        <Image 
                            src={image.url} 
                            alt={image.title} 
                            width={image.width}
                            height={image.height}
                            className={Styles.image}
                        />
                    </Link>
                    
                </Box>
            ))}
        </Box>
    )
}
