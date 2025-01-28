'use server'

import { followUser, getUserBySub, getUserWithFollowInfo, searchUsers, unFollowUser } from "@/services/User";
import { getSession } from "@auth0/nextjs-auth0";

export async function actionGetUserIdBySub(sub?: string) {
    let session = await getSession();
    let user = session?.user;

    if (typeof sub === 'undefined') {
        session = await getSession();
        user = session?.user;
        sub = user?.sub;
    }

    const viewer = await actionGetUserBySub(sub!)

    return viewer?._id;
}

export async function actionGetUserBySub(sub: string) {
    return await getUserBySub(sub);
}

export async function actionGetUserWithFollowInfo(_id: string, targetUserSub: string) {
    const targetUserId = (await getUserBySub(targetUserSub))?._id || '';
    return await getUserWithFollowInfo(_id, targetUserId);
}

export async function actionFollowUser(targetUserId: string, userSub: string) {
    const userId = (await getUserBySub(userSub))?._id || '';
    return await followUser(userId, targetUserId);
}

export async function actionUnFollowUser(targetUserId: string, userSub: string) {
    const userId = (await getUserBySub(userSub))?._id || '';
    return await unFollowUser(userId, targetUserId);
}

export async function actionSearchUsers(query: string, targetUserSub: string, page: number = 1, pageSize: number = 10) {
    const targetUserId = (await getUserBySub(targetUserSub))?._id || '';
    return await searchUsers(query, targetUserId, page, pageSize);
}