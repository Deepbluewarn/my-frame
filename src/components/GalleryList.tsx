'use client'

import { AspectRatio, Button, Flex, Grid, Skeleton, Text } from "@mantine/core"
import GalleryComponent from "./Gallery"
import { useEffect, useRef, useState } from "react";
import { ImagePaginationParams } from "@/actions/image";
import { ImageWithOwner } from "@/services/Image";

interface GalleryListProps<T, R> {
    actionLoad: (params: T) => Promise<R[]>;
    initialParams: T;
}

export default function GalleryList<T extends ImagePaginationParams, R extends ImageWithOwner>(
    { actionLoad, initialParams }: GalleryListProps<T, R>) {
    const [images, setImages] = useState<ImageWithOwner[]>([]);
    const lastImageId = useRef(initialParams.last_image_id)
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        setLoading(true);
        
        const newImages = await actionLoad({...initialParams, last_image_id: lastImageId.current});
        updateImages(newImages);
        setLoading(false);
    };

    const updateImages = (newImages: R[]) => {
        if (!newImages || newImages.length <= 0) {
            return;
        }
        setImages(images => {
            const imageMap = new Map(images.map(image => [image._id, image]));
            newImages.forEach(image => {
                imageMap.set(image._id, image);
            });

            const res = Array.from(imageMap.values());

            lastImageId.current = res[res.length - 1]._id;

            return res;
        });
    }

    useEffect(() => {
        const fetchInitialImages = async () => {
            const initialImages = await actionLoad(initialParams);
            
            updateImages(initialImages);
        };

        fetchInitialImages();
    }, []);

    return (
        <Flex direction={'column'} justify={'center'} gap={8}>
            {
                images.length > 0 ? (
                    <GalleryComponent images={images} />
                ) : (
                    <Grid grow>
                        {
                            Array(8).fill(0).map((_, idx) => (
                                <Grid.Col key={idx} span={3}>
                                    <AspectRatio ratio={600 / 400} mx="auto">
                                        <Skeleton />
                                    </AspectRatio>
                                </Grid.Col>
                            ))
                        }
                    </Grid>
                )
            }

            <Button onClick={loadMore} disabled={loading}>
                더 보기
            </Button>
        </Flex>
    );
}
