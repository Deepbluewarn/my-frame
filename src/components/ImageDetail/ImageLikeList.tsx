import { useImageDetailStore } from "@/providers/image-detail-store-provider";
import { useUserInfoStore } from "@/providers/userid-store-provider";
import { listFormat } from "@/utils/common";
import { Flex, Text } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

export default function LikeList() {
    const currentImage = useImageDetailStore(store => store.currentImage);
    const starList = useImageDetailStore(store => store.starList);
    const actions = useImageDetailStore(store => store.actions);
    const userSub = useUserInfoStore(store => store.sub);

    if (!currentImage) {
        return null;
    }

    return (
        <Flex direction='column' gap={8}>
            <Flex direction='row' justify={'space-between'}>
                <Text>좋아요 {currentImage.likes?.length || 0}개</Text>
                {
                    starList.some(sList => sList.sub === userSub) ? (
                        <IconStarFilled onClick={() => { actions.star.remove() }} />
                    ) : (
                        <IconStar onClick={() => { actions.star.add() }} />
                    )
                }
            </Flex>
            <Text>{listFormat(starList.map(l => l.username))}</Text>
        </Flex>
    )
}
