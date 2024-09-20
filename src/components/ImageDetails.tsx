'use client'

import { ImageWithOwner } from "@/services/Image";
import { useCallback, useEffect } from 'react';
import GalleryFrame from "@/components/GalleryFrame";
import useImageList from "@/hooks/useImageList";
import Styles from '@/styles/components/imageDetails.module.css';
import {
    ActionIcon, Avatar, Box, Button,
    Divider, Flex, List, Pill, PillGroup,
    PillsInput, Text, TextInput
} from "@mantine/core";
import { IconCircleChevronLeft, IconCircleChevronRight } from "@tabler/icons-react";

export default function ImageDetails({ images }: { images: ImageWithOwner[] }) {
    console.log('ImageDetails: ', images)

    const { next, prev, list, current, loading } = useImageList(images);

    const onNextClicked = useCallback(async () => {
        if (loading) return;
        next()
    }, [next, loading]);

    const onPrevClicked = useCallback(() => {
        if (loading) return;
        prev()
    }, [prev, loading])

    if (!current) return null;

    return (
        <Box className={Styles.container}>
            <Box className={Styles.image_container}>
                <ActionIcon
                    variant="default"
                    onClick={onPrevClicked}
                    disabled={loading}
                >
                    <IconCircleChevronLeft />
                </ActionIcon>
                <GalleryFrame
                    width={current.width}
                    height={current.height}
                    url={current.url}
                    title={current.title}
                    description={current.description}
                    tags={current.tags}
                    likes={current.likes || 0}
                />
                <ActionIcon
                    variant="default"
                    onClick={onNextClicked}
                    disabled={loading}
                >
                    <IconCircleChevronRight />
                </ActionIcon>
            </Box>
            <Flex className={Styles.detail_container}>
                <Flex direction='column' flex='1' className={Styles.detail_left}>
                    <Flex className={Styles.profile_container} gap={16}>
                        <Avatar
                            size="lg"
                            src={current.ownerDetails.profilePicture}
                            alt={current.ownerDetails.username}
                            radius="xl"
                        />
                        <Flex direction='column' gap={8}>
                            <Text fw={700}>{current.ownerDetails.username}</Text>
                            <Text fw={500}>{current.title}</Text>
                            <Text>{current.description}</Text>
                        </Flex>
                    </Flex>

                    <Divider className={Styles.list_divider}/>

                    <Box>
                        <PillsInput label="태그">
                            <PillGroup>
                                {
                                    current.tags.map(tag =>
                                        <Pill
                                            withRemoveButton
                                            onRemove={() => console.log('remove')}
                                            key={tag}
                                        >
                                            {tag}
                                        </Pill>
                                    )
                                }
                                <PillsInput.Field placeholder="태그 추가 (공백으로 구분)" />
                            </PillGroup>
                        </PillsInput>
                    </Box>

                    <Divider className={Styles.list_divider}/>

                    <Flex direction='column' gap={8}>
                        <Text>좋아요 {current.likes || 0}개</Text>
                        <Button>좋아요</Button>
                    </Flex>

                    <Divider className={Styles.list_divider}/>

                    <Text>댓글 {current.comments.length}개</Text>

                    <Box>
                        {
                            current.comments.map(comment => (
                                <Flex gap={8} align='center'>
                                    {/* <Avatar
                                                    size="md"
                                                    src={comment.user.profilePicture}
                                                    alt={comment.user.username}
                                                    radius="xl"
                                                />
                                                <Flex direction='column' gap={8}>
                                                    <Text fw={700}>{comment.user.username}</Text>
                                                    <Text>{comment.text}</Text>
                                                </Flex> */}
                                </Flex>
                            ))
                        }
                    </Box>

                    <Divider className={Styles.list_divider}/>

                    <Box>
                        <TextInput placeholder="댓글 추가하기" />
                    </Box>
                </Flex>
                <Flex direction='column' flex='1' className={Styles.detail_right}>
                    <List>
                        <Text fw={700}>이미지 정보</Text>
                        <List.Item>너비: {current.width}px</List.Item>
                        <List.Item>높이: {current.height}px</List.Item>
                        <List.Item>업로드 날짜: {
                            new Intl.DateTimeFormat('ko-KR',
                                { timeZone: 'Asia/Seoul', dateStyle: 'full', timeStyle: 'short' }
                            ).format(current.uploadedAt)
                        }
                        </List.Item>
                    </List>
                </Flex>

            </Flex>
        </Box>
    )
}
