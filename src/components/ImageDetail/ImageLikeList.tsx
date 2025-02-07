import { IUserInfo } from "@/db/models/User";
import useFetchWithAbortController from "@/hooks/useAsyncFnWithAbortController";
import { useImageDetailStore } from "@/providers/image-detail-store-provider";
import { useUserInfoStore } from "@/providers/userid-store-provider";
import { listFormat } from "@/utils/common";
import { Flex, Text } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useEffect } from "react";

export default function LikeList() {
    const currentImage = useImageDetailStore(store => store.currentImage);
    const currentImageId = useImageDetailStore(store => store.currentImageId);
    const starList = useImageDetailStore(store => store.starList);
    const likeActions = useImageDetailStore(store => store.actions.star);
    const userSub = useUserInfoStore(store => store.sub);
    const { response: likes } = useFetchWithAbortController<IUserInfo[]>(
        `/api/like?imageId=${currentImageId}`,
        {
            method: "GET",
        },
        [ currentImageId ]
    )

    useEffect(() => {
        if (!likes) {
            return;
        }
        likeActions.init(likes)
    }, [likes])

    if (!currentImage) {
        return null;
    }

    return (
        <Flex direction='column' gap={8}>
            <Flex direction='row' justify={'space-between'}>
                <Text>좋아요 {starList?.length || 0}개</Text>
                {
                    starList.some(sList => sList.sub === userSub) ? (
                        <IconStarFilled onClick={() => { likeActions.remove() }} />
                    ) : (
                        <IconStar onClick={() => { likeActions.add() }} />
                    )
                }
            </Flex>
            <Text>{listFormat(starList.map(l => l.username))}</Text>
        </Flex>
    )
}
