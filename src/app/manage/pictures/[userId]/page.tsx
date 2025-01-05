'use client'

import { actionGetUserImagesByDate } from '@/actions/image';
import { Box, Button, Flex, Modal, Paper, Text } from '@mantine/core';
import Styles from '@/styles/managePicture.module.css';
import { Fragment, useEffect, useState } from 'react';
import { ImageWithOwner } from '@/services/Image';
import ImageThumbnail from '@/components/ImageThumbnail';
import { useImageSelection } from '@/hooks/useImageSelection';
import { useDisclosure } from '@mantine/hooks';
import EditImageMetadata from '@/components/EditImageMetadata';

export default function ManagePictures({ params }: { params: { userId: string } }) {
    const [imageGroupedByTime, setImageGroupedByTime] = useState<[time: number, images: ImageWithOwner[]][]>([]);
    const { selectedImageList, toggleSelection, reset } = useImageSelection();
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        const asyncFn = async () => {
            updateImages(await actionGetUserImagesByDate({
                limit: 4, user_id: params.userId
            }))
        }
        asyncFn();
    }, [])

    const updateImages = (imgs: [number, ImageWithOwner[]][]) => {
        setImageGroupedByTime(prev => {
            const newImages = imgs.filter(([time]) => !prev.some(([prevTime]) => prevTime === time));
            return [...prev, ...newImages];
        });
    }

    const loadMore = async () => {
        updateImages(await actionGetUserImagesByDate({
            limit: 4, user_id: params.userId,
            last_image_date: imageGroupedByTime[imageGroupedByTime.length - 1][0]
        }))
    }

    return (
        <>
            <Modal opened={opened} onClose={close} title="사진 편집">
                <EditImageMetadata selectedImages={selectedImageList} done={() => {
                    close();
                    reset();
                }} />
            </Modal>

            <Box className={Styles.container}>
                <Flex direction='column' gap={16}>
                    <Paper withBorder className={Styles.panel_container}>
                        <Flex align='center' justify='space-between'>
                            <Text>{selectedImageList.length}개 선택 됨</Text>
                            {
                                selectedImageList.length > 0 ? (
                                    <Flex gap={8}>
                                        <Button onClick={open}>편집</Button>
                                        <Button color='red'>삭제</Button>
                                    </Flex>
                                ) : null
                            }
                        </Flex>
                    </Paper>
                    {
                        imageGroupedByTime.map(imageByTime => {
                            return (
                                <Fragment key={imageByTime[0]}>
                                    <Text>{new Date(imageByTime[0]).toLocaleDateString()}</Text>
                                    <Flex gap={14} wrap='wrap'>
                                        {
                                            imageByTime[1].map(image => {
                                                const selected = selectedImageList.some(i => i._id === image._id);
                                                return (
                                                    <ImageThumbnail
                                                        image={image}
                                                        size={80}
                                                        selected={selected}
                                                        onThumbnailClick={toggleSelection}
                                                    />
                                                )
                                            })
                                        }
                                    </Flex>
                                </Fragment>
                            )
                        })
                    }
                    <Button color='gray' onClick={loadMore}>더 보기</Button>
                </Flex>
            </Box>
        </>
    )
}
