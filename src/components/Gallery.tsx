'use client'

import { Box } from "@mantine/core";
import Styles from '@/styles/components/Gallery.module.css';
import { UserInterface } from "@/db/models/User";
import GalleryFrame from "./GalleryFrame";

export interface IGallery {
    _id: string;
    url: string;
    title: string;
    width: number;
    height: number;
    ownerDetails: UserInterface;
}

export default function GalleryComponent({ images }: { images?: IGallery[] }) {
    return (
        <Box className={Styles.container}>
            {images?.map((image) => (
                <GalleryFrame 
                    gallery={image} 
                    imageStyle={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                    }}
                    key={image._id}
                    overlay={true}
                    link={true}
                />
            ))}
        </Box>
    )
}
