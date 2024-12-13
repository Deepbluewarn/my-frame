import ProfileAvatar from "@/components/ProfileAvatar";
import { Box, Divider } from "@mantine/core";
import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import Styles from '@/styles/user.module.css';
import GalleryList from "@/components/GalleryList";
import { actionGetUserImages } from "@/actions/image";
import { actionGetUserWithFollowInfo } from "@/actions/user";
import { getSession } from "@auth0/nextjs-auth0";

export default async function Page({ params }: { params: { _id: string } }) {
    if (!isValidObjectId(params._id)) {
        notFound();
    }

    const session = await getSession()
    const user = session?.user;

    const userInfo = (await actionGetUserWithFollowInfo(params._id, user?.sub))[0];
    return (
        <>
            <Box className={Styles.profile_container}>
                <ProfileAvatar userInfo={userInfo} />
            </Box>
            <Divider />

            <ul className={Styles.btn_list}>
                <li>최근 사진</li>
            </ul>

            <Divider />

            <GalleryList actionLoad={actionGetUserImages} initialParams={{
                limit: 10, user_id: params._id
            }} />
        </>
    )
}