'use server'

import { deleteUserAuth0, deleteUserBySub, followUser, getUserBySub, getUserWithFollowInfo, searchUsers, unFollowUser } from "@/services/User";
import { getSession } from "@auth0/nextjs-auth0";
import { actionDeleteAllUserImages } from "../image";

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

export async function actionGetUserWithFollowInfo(_id: string, targetUserSub?: string) {
    let targetUserId = '';

    if (typeof targetUserSub !== 'undefined') {
        targetUserId = (await getUserBySub(targetUserSub))?._id || '';
    }
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

export async function actionDeleteUser() {
    const session = await getSession();

    if (!session) {
        throw new Error('세션을 찾을 수 없습니다.');
    }

    const user = session.user;

    const auth0_user_deleted = await deleteUserAuth0(user.sub);
    const user_deleted = await deleteUserBySub(user.sub);

    return { auth0_user_deleted, user_deleted }
}

export async function actionUserSelfDelete(userId: string) {
    const session = await getSession();

    if (!session) {
        throw new Error('세션을 찾을 수 없습니다.');
    }

    const { images_deleted, s3_deleted } = await actionDeleteAllUserImages(userId);
    const { auth0_user_deleted, user_deleted } = await actionDeleteUser();

    return auth0_user_deleted && user_deleted && images_deleted && s3_deleted;
}
