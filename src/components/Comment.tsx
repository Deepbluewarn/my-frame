'use client'

import { IComment } from "@/db/models/Image";
import { IUserInfo } from "@/db/models/User";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, Button, Flex, Text } from "@mantine/core";

export default function Comment(
    { imageId, comment, removeComment, pictureOwnerSub }:
    { imageId: string, comment: IComment[], removeComment: (commentId: string) => void, pictureOwnerSub?: string }
) {
    const { user } = useUser();

    return (
        <Flex gap={8} direction={'column'}>
            {
                comment.map(cmt => (

                    <Flex gap={8} align='center' key={cmt._id}>
                        <Avatar
                            size="md"
                            src={(cmt.commenter as IUserInfo).profilePicture}
                            alt={(cmt.commenter as IUserInfo).username}
                            radius="xl"
                        />

                        <Flex direction='column' gap={4}>
                            <Flex>
                                {
                                    pictureOwnerSub === (cmt.commenter as IUserInfo).sub ? (
                                        <Text>👑</Text>
                                    ) : (
                                        null
                                    )
                                }
                                <Text fw={700}>{(cmt.commenter as IUserInfo).username}</Text>
                            </Flex>
                            <Text>{cmt.text}</Text>
                        </Flex>
                        {
                            user?.sub === (cmt.commenter as IUserInfo).sub ? (
                                <Button 
                                    variant="transparent" 
                                    style={{
                                        alignSelf: 'flex-start',
                                        margin: '0 0 0 auto'
                                    }}
                                    onClick={() => {removeComment(cmt._id)}}
                                >
                                    삭제
                                </Button>
                            ) : null
                        }

                    </Flex>
                ))
            }
        </Flex>
    )
}
