import { getUserBySub, getUserInfoWithFollow } from "@/services/User";
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
export async function actionGetUserInfoWithFollow(_id: string) {
    return await getUserInfoWithFollow(_id);
}
