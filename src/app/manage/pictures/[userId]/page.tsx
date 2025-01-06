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
import DeleteConfirmation from '@/components/DeleteConfirmation';

export default function ManagePictures({ params }: { params: { userId: string } }) {
    const [imageGroupedByTime, setImageGroupedByTime] = useState<[time: number, images: ImageWithOwner[]][]>([]);
    const { selectedImageList, toggleSelection, reset } = useImageSelection();
    const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [
        deleteConfirmModalOpened, 
        { 
            open: openDeleteConfirmModal, 
            close: closeDeleteConfirmModal 
        }
    ] = useDisclosure(false);

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
            <Modal opened={editModalOpened} onClose={closeEditModal} title="사진 편집">
                <EditImageMetadata selectedImages={selectedImageList} done={(refresh) => {
                    if (refresh) {
                        location.reload();
                    }
                    closeEditModal();
                    reset();
                }} />
            </Modal>

            <Modal opened={deleteConfirmModalOpened} onClose={closeDeleteConfirmModal} title="사진 삭제 확인">
                <DeleteConfirmation selectedImages={selectedImageList} done={(refresh) => {
                    console.log(refresh)
                    if (refresh) {
                        location.reload();
                    }
                    closeDeleteConfirmModal();
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
                                        <Button onClick={openEditModal}>편집</Button>
                                        <Button onClick={openDeleteConfirmModal} color='red'>삭제</Button>
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
                                                        key={image._id}
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
