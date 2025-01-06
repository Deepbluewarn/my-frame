import { Flex } from "@mantine/core";
import { ImageWithOwner } from "@/services/Image";
import ImageThumbnail from "./ImageThumbnail";

export default function ImageThumbnailList({
    list, currentImageId
} : {
    list: (ImageWithOwner | undefined)[],
    currentImageId?: string,
}) {
    const imageList = list.map((l, idx) => {
        if (!l) return;

        return <ImageThumbnail key={l._id} image={l} current={l._id === currentImageId}/>
    })

    return (
        <Flex gap={14}>
            {imageList}
        </Flex>
    )
}