import { Avatar, Box, Button, Divider, Flex, Text } from "@mantine/core";
import Styles from '@/styles/components/Header.module.css'
import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import AuthenticatedHeader from "./AuthenticateHeader";
import UnauthenticatedHeader from "./UnauthenticateHeader";
import HeaderDrawer from "./Drawer";
import { getUserBySub } from "@/services/User";
import { UserInterface } from "@/db/models/User";
import SearchInput from "../SearchInput";

export default async function Header({ fixed = true }: { fixed?: boolean }) {
    const session = await getSession();
    const user = session?.user;
    const userInfo = (await getUserBySub(user?.sub))?.toJSON() as UserInterface;
    const headerClassNames = [Styles.header, fixed ? Styles.fixed : ''];

    return (
        <header className={headerClassNames.join(' ')}>
            <div className={Styles.inner}>
                <Box className={Styles.logo}>
                    <Link href={'/'}><Text fw={700} size="lg">MY FRAME</Text></Link>
                </Box>
                {
                    user ? (
                        <>
                            <Box className={Styles.links} visibleFrom="sm">
                                <AuthenticatedHeader userInfo={userInfo} />
                            </Box>
                            <HeaderDrawer>
                                <>
                                    <SearchInput className={Styles['drawer_item']} />
                                    <Divider my="sm" />

                                    <Link href={'/explore/public'} className={Styles['drawer_item']}>탐색</Link>
                                    <Link href={'/explore/follow'} className={Styles['drawer_item']}>팔로우</Link>
                                    <Link href='/upload' className={Styles['drawer_item']}>사진 업로드</Link>

                                    <Divider my="sm" />

                                    <Link href={`/user/${userInfo._id}`} className={Styles['drawer_item']}>내 사진</Link>
                                    <Link href={`/manage/pictures/${userInfo._id}`} className={Styles['drawer_item']}>사진 관리</Link>

                                    <Divider my="sm" />
                                    
                                    <Flex gap={8} className={`${Styles['drawer_item']} ${Styles['avatar']}`}>
                                        <Avatar src={userInfo.profilePicture} alt={userInfo.username}/>
                                        <Text>{userInfo.username}</Text>
                                        <Button 
                                            className={Styles['avatar_logout']}
                                            component="a"
                                            href='/api/auth/logout'
                                        >
                                            로그아웃
                                        </Button>
                                    </Flex>
                                </>
                            </HeaderDrawer>
                        </>
                    ) : (
                        <UnauthenticatedHeader />
                    )
                }
            </div>
        </header>
    )
}
