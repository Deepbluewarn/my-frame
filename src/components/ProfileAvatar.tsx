import { actionGetUserWithFollowInfo } from "@/actions/user";
import { getSession } from "@auth0/nextjs-auth0";
import {
    Flex, Text, Avatar
} from "@mantine/core";
import { isValidObjectId } from "mongoose";
import FollowButton from "./FollowButton";

export default async function ProfileAvatar({ userId }: { userId: string }) {
    if (!isValidObjectId(userId)) {
        return null;
    }

    const session = await getSession();
    const currentUser = session?.user;

    if (!currentUser) {
        return null;
    }

    const userFollowInfo = (await actionGetUserWithFollowInfo(userId, currentUser.sub))[0];

    if (!userFollowInfo) {
        return null;
    }

    
    return (
        <Flex gap={8}>
            <Avatar src={userFollowInfo.profilePicture} alt={userFollowInfo.username} />
            <Flex direction='column' gap={8}>
                <Flex align={'center'} gap={16}>
                    <Text component="div" style={{
                        maxWidth: '10rem',
                        wordBreak: 'break-word',
                    }}>{userFollowInfo.username}</Text>
                </Flex>
                {
                    currentUser?.sub === userFollowInfo.sub ? (
                        null
                    ) : (
                        <FollowButton userId={userId} currentUserSub={currentUser.sub}/>
                    )
                }

                <Flex gap={16}>
                    <Text>{`${userFollowInfo.followersCount} 팔로워`}</Text>
                    <Text>{`${userFollowInfo.followingCount} 팔로잉`}</Text>
                </Flex>
            </Flex>
        </Flex>
    )
}
