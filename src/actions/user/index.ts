import { getUserInfoWithFollow } from "@/services/User";

export async function actionGetUserInfoWithFollow(_id: string) {
    return await getUserInfoWithFollow(_id);
}
