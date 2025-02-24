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
export default function ProfileAvatar(
    { userId, userInfo } : { userId?: string, userInfo?: IUserWithFollowInfo }
) {
    // currentUser: 현재 접속한 회원의 객체
    const { user: currentUser, error, isLoading } = useUser();
    const currentUserId = useUserInfoStore(store => store._id);
    const [uinfo, setUInfo] = useState<IUserWithFollowInfo | undefined>(userInfo);

    useEffect(() => {
        const asyncFn = async () => {
            let uid = userId;

            if (typeof userId === 'undefined') {
                uid = currentUserId;
            }
            setUInfo((await actionGetUserWithFollowInfo(uid!))[0]);
        }

        if (userId) {
            asyncFn();
        }
    }, [])

    if (!uinfo) {
        return null;
    }
    if (!currentUser || !currentUser.sub || error || isLoading) {
        return null;
    }

    return (
        <Flex gap={8}>
            <Avatar src={uinfo.profilePicture} alt={uinfo.username} />
            <Flex direction='column' gap={8}>
                <Flex align={'center'} gap={16}>
                    <Text component="div" style={{
                        maxWidth: '10rem',
                        wordBreak: 'break-word',
                    }}>{uinfo.username}</Text>
                    {
                        currentUser?.sub === uinfo?.sub ? (
                            null
                        ) : (
                            <FollowButton userId={uinfo._id} currentUserSub={currentUser.sub} />
                        )
                    }
                </Flex>

                <Flex gap={16}>
                    <Text>{`${uinfo.followersCount} 팔로워`}</Text>
                    <Text>{`${uinfo.followingCount} 팔로잉`}</Text>
                </Flex>
            </Flex>
        </Flex>
    )
}
