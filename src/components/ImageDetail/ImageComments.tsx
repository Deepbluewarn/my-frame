import { Box, Divider, Text, TextInput } from '@mantine/core';
import { useImageDetailStore } from "@/providers/image-detail-store-provider";
import Comment from '@/components/ImageDetail/Comment';
import Styles from '@/styles/components/imageDetails.module.css';
import { useEffect, useState } from 'react';
import useFetchWithAbortController from '@/hooks/useAsyncFnWithAbortController';
import { IComment } from '@/db/models/Image';

export default function ImageComments() {
    const currentImageId = useImageDetailStore(store => store.currentImageId);
    const comments = useImageDetailStore(store => store.comments);
    const commentsActions = useImageDetailStore(store => store.actions.comment);
    const [commentStrInput, setCommentStrInput] = useState('');

    const onImageCommentEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        const target = e.currentTarget;

        await commentsActions.add(target.value)
        setCommentStrInput('');
    }

    const {response: fetchedComments, loading} = useFetchWithAbortController<IComment[]>(
        `/api/comments?imageId=${currentImageId}`,
        {
            method: "GET",
        },
        [currentImageId]
    )
    
    useEffect(() => {
        commentsActions.init(fetchedComments || []);
    }, [fetchedComments])

    if (!currentImageId) {
        return null;
    }

    return (
        <>
            {
                !loading ? (
                    comments ? (
                        <>
                            <Text>댓글 {comments.length}개</Text>
                            {
                                comments.map(cmt => <Comment key={cmt._id} comment={cmt} />)
                            }
                        </>
                    ) : <Text>댓글 0개</Text>
                ) : (
                    <Text>댓글을 가져오는 중..</Text>
                )
            }
            <Divider className={Styles.list_divider} />

            <Box>
                <TextInput
                    value={commentStrInput}
                    onChange={(e) => setCommentStrInput(e.target.value)}
                    onKeyDown={onImageCommentEnter}
                    placeholder="댓글 추가하기"
                />
            </Box>
        </>
    )
}