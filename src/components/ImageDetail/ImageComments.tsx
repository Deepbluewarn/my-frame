import { Box, Divider, Text, TextInput } from '@mantine/core';
import { useImageDetailStore } from "@/providers/image-detail-store-provider";
import Comment from '@/components/ImageDetail/Comment';
import Styles from '@/styles/components/imageDetails.module.css';
import { useState } from 'react';

export default function ImageComments() {
    const currentImage = useImageDetailStore(store => store.currentImage);
    const comments = useImageDetailStore(store => store.comments);
    const commentsActions = useImageDetailStore(store => store.actions.comment)
    const [commentStrInput, setCommentStrInput] = useState('');

    const onImageCommentEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        const target = e.currentTarget;

        await commentsActions.add(target.value)
        setCommentStrInput('');
    }

    if (!currentImage) {
        return;
    }

    return (
        <>
            {
                comments ? (
                    <>
                        <Text>댓글 {comments.length}개</Text>
                        {
                            comments.map(cmt => <Comment key={cmt._id} comment={cmt}/>)
                        }
                    </>
                ) : <Text>댓글 0개</Text>
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