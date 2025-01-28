'use client'

import { IComment } from "@/db/models/Image";
import { IUserInfo } from "@/db/models/User";
import { useImageDetailStore } from "@/providers/image-detail-store-provider";
import { useUserInfoStore } from "@/providers/userid-store-provider";
import { Avatar, Button, Flex, Text } from "@mantine/core";

export default function Comment({ comment }: { comment: IComment }) {
    const userSub = useUserInfoStore(store => store.sub);
    const commentsActions = useImageDetailStore(store => store.actions.comment);

    return (
        <Flex m={8} gap={8} align='center' key={comment._id}>
            <Avatar
                size="md"
                src={(comment.commenter as IUserInfo).profilePicture}
                alt={(comment.commenter as IUserInfo).username}
                radius="xl"
            />

            <Flex direction='column' gap={4}>
                <Flex>
                    {
                        userSub === (comment.commenter as IUserInfo).sub ? (
                            <Text>👑</Text>
                        ) : (
                            null
                        )
                    }
                    <Text fw={700}>{(comment.commenter as IUserInfo).username}</Text>
                </Flex>
                <Text>{comment.text}</Text>
            </Flex>
            {
                userSub === (comment.commenter as IUserInfo).sub ? (
                    <Button
                        variant="transparent"
                        style={{
                            alignSelf: 'flex-start',
                            margin: '0 0 0 auto'
                        }}
                        onClick={async () => { await commentsActions.remove(comment._id) }}
                    >
                        삭제
                    </Button>
                ) : null
            }
        </Flex>
    )
}
