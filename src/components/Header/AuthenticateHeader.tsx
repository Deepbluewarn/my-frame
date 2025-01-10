import { Flex } from "@mantine/core"
import SearchInput from "../SearchInput"
import Link from "next/link"
import Styles from '@/styles/components/Header.module.css'
import { IconUpload } from "@tabler/icons-react"
import MenuAvatar from "../MenuAvatar"
import { UserInterface } from "@/db/models/User"

export default async function AuthenticatedHeader(
    { userInfo } : 
    { userInfo?: UserInterface }
) {
    if (!userInfo) {
        return null;
    }
    
    return (
        <>
            <Flex gap={32}>
                <SearchInput />
                <Link href={'/explore/public'} className={Styles['centered-link']}>탐색</Link>
                <Link href={'/explore/follow'} className={Styles['centered-link']}>팔로우</Link>
                <Link href='/upload' className={Styles['centered-link']}><IconUpload /></Link>
            </Flex>

            <MenuAvatar 
                userId={userInfo._id} 
                userName={userInfo?.username}
                userPicture={userInfo.profilePicture || ''}
            />
        </>
    )
}
