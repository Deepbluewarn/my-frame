'use client'

import {
    Flex, Text, Avatar
} from "@mantine/core";
import FollowButton from "./FollowButton";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { IUserWithFollowInfo } from "@/services/User";
import { useUserInfoStore } from "@/providers/userid-store-provider";
import { actionGetUserWithFollowInfo } from "@/actions/user";

// userInfo: 표시하고자 하는 회원 객체
export default function ProfileAvatar({ userId } : { userId?: string }) {
    // currentUser: 현재 접속한 회원의 객체
    const { user: currentUser, error, isLoading } = useUser();
    const currentUserId = useUserInfoStore(store => store._id);
    const [userInfo, setUserInfo] = useState<IUserWithFollowInfo | undefined>();

    useEffect(() => {
        const asyncFn = async () => {
            let uid = userId;

            if (typeof userId === 'undefined') {
                uid = currentUserId;
            }
            setUserInfo((await actionGetUserWithFollowInfo(uid!))[0]);
        }
        asyncFn();
    }, [])

    if (!userInfo) {
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
                        currentUser?.sub === userInfo?.sub ? (
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
