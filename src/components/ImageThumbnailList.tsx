import { ImageWithOwnerPagination } from "@/hooks/useImageList";
import { Flex } from "@mantine/core";
import Image from "next/image";

export default function ImageThumbnailList({
    list
} : {
    list: (ImageWithOwnerPagination | undefined)[]
}) {
    const midIdx = list.length % 2;
    const imageList = list.map((l, idx) => {
        if (!l) return;
        if (midIdx === idx) {
            // 이미지 하이라이트
        }
        return (
            <Image src={l.url} width={30} height={30} alt={l.title}/>
        )
    })

    return (
        <Flex gap={14}>
            { imageList }
        </Flex>
    )
}