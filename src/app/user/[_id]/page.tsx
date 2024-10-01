import { actionGetUserInfoWithFollow } from "@/actions/user";
import ProfileAvatar from "@/components/ProfileAvatar";
import { Box, Divider } from "@mantine/core";
import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import Styles from '@/styles/user.module.css';
import RecentPublicImages from "@/components/Images/RecentPublicImages";

export default async function Page({ params }: { params: { _id: string } }) {
    if (!isValidObjectId(params._id)) notFound();

    const userInfo = (await actionGetUserInfoWithFollow(params._id))[0]

    return (
        <>
            <Box className={Styles.profile_container}>
                <ProfileAvatar
                    name={userInfo.username}
                    picture={userInfo.profilePicture}
                    followers={userInfo.followers.length}
                    following={userInfo.following.length}
                />
            </Box>
            <Divider />

            <ul className={Styles.btn_list}>
                <li>최근 사진</li>
            </ul>

            <Divider />

            <RecentPublicImages userId={params._id}/>
        </>
    )
}