import { Box, Button } from "@mantine/core";
import Styles from '../styles/Header/Header.module.css'
import { getSession } from "@auth0/nextjs-auth0";
import MenuAvatar from "./MenuAvatar";
import { IconUpload } from "@tabler/icons-react";
import Link from "next/link";

export default async function Header({ fixed = true }: { fixed?: boolean }) {
    const session = await getSession();
    const user = session?.user;

    const headerClassNames = [Styles.header, fixed ? Styles.fixed : ''];

    return (
        <header className={headerClassNames.join(' ')}>
            <div className={Styles.inner}>
                <Box className={Styles.logo}>
                    <h2>MY FRAME</h2>
                </Box>
                <Box className={Styles.links}>
                    {
                        user ? (
                            <>
                                <Link className={Styles.upload} href='/upload'><IconUpload /></Link>
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
