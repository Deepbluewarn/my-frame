import { Types } from 'mongoose';
import { UserInterface } from "@/db/models/User";
import { createUser, getUserBySub, updateUserBySub } from "@/services/User";
import { decodeJwt } from "@/utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";

function redirectToContinue(state: string, success: boolean) {
    redirect(`${process.env.AUTH0_ISSUER_BASE_URL}/continue?state=${state}&dbSuccess=${success}`);
}
export default async function Landing({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const state = searchParams.state;
    const token = searchParams.session_token;
    let success = false;

    const payload = decodeJwt(token as string) as JwtPayload;

    if (!payload) redirectToContinue(state as string, success);

    const sub = payload!.user_id;
    const username = payload!.nickname || payload!.name;
    const email = payload!.email;
    const profilePicture = payload!.picture;

    const userData: UserInterface = {
        _id: (new Types.ObjectId).toString(),
        sub, username, email, profilePicture,
    };

    try {
        const existingUser = await getUserBySub(sub);

        if (!existingUser) {
            await createUser(userData);
        } else {
            userData.updatedAt = new Date();
            await updateUserBySub(sub, userData);
        }
        success = true;
    } catch (e) {
        success = false;
    } finally {
        redirectToContinue(state as string, success);
    }
}
