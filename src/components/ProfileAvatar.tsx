'use client'

import {
    Flex, Text, Avatar
} from "@mantine/core";
import FollowButton from "./FollowButton";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import { IUserWithFollowInfo } from "@/services/User";

export default function ProfileAvatar({ userInfo } : { userInfo: IUserWithFollowInfo }) {
    const { user: currentUser, error, isLoading } = useUser();
    const [userFollowInfo, setUserFollowInfo] = useState<IUserWithFollowInfo>(userInfo);

    if (!userFollowInfo) {
        return null;
    }
    if (!currentUser || !currentUser.sub) {
        return null;
    }

    return (
        <Flex gap={8}>
            <Avatar src={userInfo.profilePicture} alt={userInfo.username} />
            <Flex direction='column' gap={8}>
                <Flex align={'center'} gap={16}>
                    <Text component="div" style={{
                        maxWidth: '10rem',
                        wordBreak: 'break-word',
                    }}>{userInfo.username}</Text>
                    {
                        currentUser?.sub === userInfo.sub ? (
                            null
                        ) : (
                            <FollowButton userId={userInfo._id} currentUserSub={currentUser.sub} />
                        )
                    }
                </Flex>

                <Flex gap={16}>
                    <Text>{`${userInfo.followersCount} 팔로워`}</Text>
                    <Text>{`${userInfo.followingCount} 팔로잉`}</Text>
                </Flex>
            </Flex>
        </Flex>
    )
}
