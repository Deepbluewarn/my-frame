import { Flex } from "@mantine/core";
import { ImageWithOwner } from "@/services/Image";
import ImageThumbnail from "../ImageThumbnail";
import { useImageDetailStore } from "@/providers/image-detail-store-provider";
import { updateHistory } from "@/utils/common";

export default function ImageThumbnailList({
    list, currentImageId
} : {
    list: (ImageWithOwner | null)[],
    currentImageId?: string,
}) {
    const setCurrentImageId = useImageDetailStore(store => store.actions.common.setId);    
    const imageList = list.map((l) => {
        if (!l) return;

        return <ImageThumbnail 
            key={l._id} image={l} current={l._id === currentImageId}
            onThumbnailClick={(image) => {
                if (image?._id) {
                    setCurrentImageId(image?._id);
                    updateHistory(`/image/${image?._id}`);
                }
            }}
        />
    })

    return (
        <Flex gap={14}>
            {imageList}
        </Flex>
    )
}