'use client'

import { Avatar, Menu, MenuDivider, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Text, rem } from '@mantine/core';
import {
    IconPhoto,
    IconLogout,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function MenuAvatar(
    { 
        userId, userPicture, userName
    } : 
    { 
        userId: string,
        userPicture: string,
        userName: string
    }
) {
    return (
        <Menu shadow="md" width={200}>
            <MenuTarget>
                <Avatar src={userPicture} alt={userName} />
            </MenuTarget>

            <MenuDropdown>
                <MenuItem leftSection={<IconPhoto style={{ width: rem(14), height: rem(14) }} />}>
                    <Link href={`/user/${userId}`}>내 사진</Link>
                </MenuItem>
                <MenuItem>
                    <Link href={`/manage/pictures/${userId}`}>사진 관리</Link>
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