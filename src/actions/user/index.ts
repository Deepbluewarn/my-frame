'use server'

import { followUser, getUserBySub, getUserWithFollowInfo, unFollowUser } from "@/services/User";
import { getSession } from "@auth0/nextjs-auth0";

export async function actionGetUserIdBySub() {
    const session = await getSession();
    const user = session?.user;

    const viewer = await actionGetUserBySub(user?.sub)

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
