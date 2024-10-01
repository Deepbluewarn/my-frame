import { getUserBySub } from '@/services/User';
import { getSession } from '@auth0/nextjs-auth0';
import { Avatar, Button, Menu, MenuDivider, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Text, rem } from '@mantine/core';
import {
    IconSearch,
    IconPhoto,
    IconLogout,
} from '@tabler/icons-react';
import Link from 'next/link';

export default async function MenuAvatar() {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
        return null
    }
    const userInfo = await getUserBySub(user.sub);

    if (!userInfo) return null;

    return (
        <Menu shadow="md" width={200}>
            <MenuTarget>
                <Avatar src={user.picture} alt={user.name} />
            </MenuTarget>

            <MenuDropdown>
                <MenuItem leftSection={<IconPhoto style={{ width: rem(14), height: rem(14) }} />}>
                    <Link href={`/user/${userInfo._id}`}>내 사진</Link>
                </MenuItem>
                <MenuItem
                    leftSection={<IconSearch style={{ width: rem(14), height: rem(14) }} />}
                >
                    검색
                </MenuItem>

                <MenuDivider />
                <MenuItem
                    color="red"
                    leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                >
                    <a href='/api/auth/logout'>로그아웃</a>
                </MenuItem>
            </MenuDropdown>
        </Menu>
    );
}