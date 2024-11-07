import { IUserInfo } from "@/db/models/User";
import { listFormat } from "@/utils/common";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Flex, Text } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

export default function StarList(
    { starList, addStar, removeStar }:
        {
            starList: IUserInfo[],
            addStar: (userSub?: string | null) => Promise<void>,
            removeStar: (userSub?: string | null) => Promise<void>,
        }
) {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <Flex direction='column' gap={8}>
            <Flex direction='row' justify={'space-between'}>
                <Text>좋아요 {starList.length || 0}개</Text>
                {
                    starList.some(sList => sList.sub === user?.sub) ? (
                        <IconStarFilled onClick={() => { removeStar(user?.sub) }} />
                    ) : (
                        <IconStar onClick={() => { addStar(user?.sub) }} />
                    )
                }
            </Flex>
            <Text>{listFormat(starList.map(l => l.username))}</Text>
        </Flex>

    )
}
