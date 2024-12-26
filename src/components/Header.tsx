import { Box, Button, Flex, Text } from "@mantine/core";
import Styles from '../styles/components/Header.module.css'
import { getSession } from "@auth0/nextjs-auth0";
import MenuAvatar from "./MenuAvatar";
import { IconUpload } from "@tabler/icons-react";
import Link from "next/link";
import SearchInput from "./SearchInput";

export default async function Header({ fixed = true }: { fixed?: boolean }) {
    const session = await getSession();
    const user = session?.user;

    const headerClassNames = [Styles.header, fixed ? Styles.fixed : ''];

    return (
        <header className={headerClassNames.join(' ')}>
            <div className={Styles.inner}>
                <Box className={Styles.logo}>
                    <Link href={'/'}><Text fw={700} size="lg">MY FRAME</Text></Link>
                </Box>
                <Box className={Styles.links}>
                    {
                        user ? (
                            <>
                                <Flex gap={32}>
                                    <SearchInput />
                                    <Link href={'/explore/public'} className={Styles['centered-link']}>탐색</Link>
                                    <Link href={'/explore/follow'} className={Styles['centered-link']}>팔로우</Link>
                                    <Link href='/upload' className={Styles['centered-link']}><IconUpload /></Link>
                                </Flex>
                                
                                <MenuAvatar />
                            </>

                        ) : (
                            <>
                                <Button
                                    component='a'
                                    href='/api/auth/login'
                                >
                                    로그인
                                </Button>
                            </>
                        )
                    }
                </Box>
            </div>
        </header>
    )
}
