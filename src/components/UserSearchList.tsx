'use client'

import { actionSearchUsers } from "@/actions/user";
import { SearchResult } from "@/services/types";
import { useEffect, useState } from "react";
import { Flex, Pagination, Text } from '@mantine/core';
import ProfileAvatar from "./ProfileAvatar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { IUserWithFollowInfo } from "@/services/User";

export default function UserSearchList({ query } : { query: string }) {
    const { user } = useUser();
    const [users, setUsers] = useState<SearchResult<IUserWithFollowInfo>>();
    const [page, setPage] = useState(1);

    useEffect(() => {
        const asyncFn = async () => {
            if (!user || !user.sub) {
                return;
            }
            const users = await actionSearchUsers(query, user.sub);
            setUsers(users);
        }
        asyncFn();
    }, [user])

    if (!users) {
        return null;
    }
    if (users.totalCount <= 0) {
        return <Text>{users.totalCount}건의 회원 검색 결과</Text>
    }
    return (
        users?.totalCount > 0 ? (
            <>
                <Text>{users.totalCount}건의 회원 검색 결과</Text>
                <Flex direction={'column'} gap={16}>
                    {
                        users.results.map(u => {
                            return <ProfileAvatar userInfo={u} />
                        })
                    }
                </Flex>
                <Pagination value={page} onChange={setPage} total={users.totalPages} />
            </>
        ) : null
    )
}
