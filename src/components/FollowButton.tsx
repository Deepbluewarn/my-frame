'use client'

import { actionFollowUser, actionGetUserWithFollowInfo, actionUnFollowUser } from "@/actions/user";
import { Button } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

export default function FollowButton(
    { userId, currentUserSub }: { userId: string, currentUserSub: string }
) {
    const [loading, setLoading] = useState(false);
    const [followed, setFollowed] = useState(false);


    const toggleFollow = useCallback(async () => {
        if (followed) {
            const unfollowResult = await actionUnFollowUser(userId, currentUserSub);

            setFollowed(!unfollowResult);
        } else {
            const followResult = await actionFollowUser(userId, currentUserSub);

            setFollowed(followResult);
        }
    }, [followed])

    useEffect(() => {
        const asyncFn = async () => {
            const userFollowInfo = (await actionGetUserWithFollowInfo(userId, currentUserSub))[0];
            setFollowed(userFollowInfo.followed);
            setLoading(true);
        }
        asyncFn();
    }, [])

    return (
        <Button onClick={toggleFollow}>
            {
                loading ? (followed ? '언팔로우' : '팔로우') : ''
            }
        </Button>
    )
}
