'use client'

import { IComment, ICommenter } from "@/db/models/Image";
import { Avatar, Flex, Text } from "@mantine/core";

export default function Comment(
    { comment, pictureOwnerSub }: 
    { comment: IComment[], pictureOwnerSub?: string }
) { 
    return (
        <Flex gap={8} direction={'column'}>
            {
                comment.map(cmt => (

                    <Flex gap={8} align='center' key={cmt._id}>
                        <Avatar
                            size="md"
                            src={(cmt.commenter as ICommenter).profilePicture}
                            alt={(cmt.commenter as ICommenter).username}
                            radius="xl"
                        />

                        <Flex direction='column' gap={4}>
                            <Flex>
                                {
                                    pictureOwnerSub === (cmt.commenter as ICommenter).sub ? (
                                        <Text>👑</Text>
                                    ) : (
                                        null
                                    )
                                }
                                <Text fw={700}>{(cmt.commenter as ICommenter).username}</Text>
                            </Flex>
                            <Text>{cmt.text}</Text>
                        </Flex>
                    </Flex>
                ))
            }
        </Flex>
    )
}
