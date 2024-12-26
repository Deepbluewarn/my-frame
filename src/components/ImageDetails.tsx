'use client'

import { ImageWithOwner } from "@/services/Image";
import { useCallback, useState } from 'react';
import GalleryFrame from "@/components/GalleryFrame";
import useImageList from "@/hooks/useImageList";
import Styles from '@/styles/components/imageDetails.module.css';
import {
    ActionIcon, Avatar, Box,
    Divider, Flex, List, Pill, PillGroup,
    PillsInput, Text, TextInput
} from "@mantine/core";
import { 
    IconCircleChevronLeft, IconCircleChevronRight, 
} from "@tabler/icons-react";
import ImageThumbnailList from "./ImageThumbnailList";
import Comment from '@/components/Comment';
import StarList from "./StarList";
import ImageSummary from "./ImageSummary";
import Link from "next/link";
import { IGallery } from "./Gallery";

export default function ImageDetails({ images }: { images: ImageWithOwner[] }) {
    const { 
        next, prev, list, current, loading, 
        addTags, removeTags, 
        addComment, removeComment, comment,
        addStar, removeStar, starList, 
        updateImageTitleAndDescription,
    } = useImageList(images);
    const [tagStrInput, setTagStrInput] = useState('');
    const [commentStrInput, setCommentStrInput] = useState('');

    const onNextClicked = useCallback(async () => {
        if (loading) return;
        next()
    }, [next, loading]);

    const onPrevClicked = useCallback(() => {
        if (loading) return;
        prev()
    }, [prev, loading])

    const onImageTagEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;

        const target = e.currentTarget;

        addTags(target.value);
        setTagStrInput('');
    }

    const onImageCommentEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        const target = e.currentTarget;

        addComment(target.value)
        setCommentStrInput('');
    }

    if (!current) return null;

    const gallery: IGallery = {
        _id: current._id,
        url: current.url,
        title: current.title,
        width: current.width,
        height: current.height,
        ownerDetails: current.ownerDetails,
    }

    return (
        <Box className={Styles.container}>
            <Box className={Styles.image_container}>
                <ActionIcon
                    variant="default"
                    onClick={onPrevClicked}
                    disabled={loading}
                    className={`${Styles.nav_prev_btn} ${Styles.nav_btn}`}
                >
                    <IconCircleChevronLeft />
                </ActionIcon>
                <GalleryFrame
                    gallery={gallery}
                    className={Styles.image}
                    imageStyle={{
                        width: '100%', objectFit: 'contain',
                    }}
                    overlay={false}
                    link={false}
                />
                <ActionIcon
                    variant="default"
                    onClick={onNextClicked}
                    disabled={loading}
                    className={`${Styles.nav_next_btn} ${Styles.nav_btn}`}
                >
                    <IconCircleChevronRight />
                </ActionIcon>

                <Box className={Styles.image_thumbnail_list}>
                    <ImageThumbnailList list={list(2)} currentImageId={current._id} />
                </Box>
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

                        <Flex direction={'column'} gap={8} style={{width: '100%'}}>
                            <Link href={`/user/${current.ownerDetails._id}`} target="_blank">
                                <Text fw={700}>{current.ownerDetails.username}</Text>
                            </Link>

                            <ImageSummary
                                username={current.ownerDetails.username}
                                title={current.title}
                                description={current.description}
                                updateImageTitleAndDescription={updateImageTitleAndDescription}
                            />
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
                                            onRemove={() => removeTags(tag)}
                                            key={tag}
                                        >
                                            {tag}
                                        </Pill>
                                    )
                                }
                                <PillsInput.Field 
                                    value={tagStrInput}
                                    onChange={(e) => {setTagStrInput(e.target.value)}}
                                    onKeyDown={onImageTagEnter} 
                                    placeholder="태그 추가 (공백으로 구분)"
                                />
                            </PillGroup>
                        </PillsInput>
                    </Box>

                    <Divider className={Styles.list_divider}/>

                    <StarList 
                        starList={starList}
                        addStar={addStar}
                        removeStar={removeStar}
                    />

                    <Divider className={Styles.list_divider}/>

                    {
                        comment ? (
                            <>
                                <Text>댓글 {comment.length}개</Text>

                                <Comment 
                                    imageId={current._id}
                                    comment={comment} 
                                    pictureOwnerSub={current.ownerDetails.sub} 
                                    removeComment={removeComment}
                                />
                            </>
                        ) : <Text>댓글 0개</Text>
                    }

                    <Divider className={Styles.list_divider}/>

                    <Box>
                        <TextInput 
                            value={commentStrInput}
                            onChange={(e) => setCommentStrInput(e.target.value)}
                            onKeyDown={onImageCommentEnter}
                            placeholder="댓글 추가하기" 
                        />
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
