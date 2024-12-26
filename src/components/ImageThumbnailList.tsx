import { ImageWithOwnerPagination } from "@/hooks/useImageList";
import { Box, Flex, stylesToString } from "@mantine/core";
import Image from "next/image";
import Styles from '@/styles/components/ImageThumbnailList.module.css';

export default function ImageThumbnailList({
    list, currentImageId
} : {
    list: (ImageWithOwnerPagination | undefined)[],
    currentImageId: string
}) {

    console.log(list)
    const imageList = list.map((l, idx) => {
        if (!l) return;

        let cName = `${Styles.image_wrapper}`

        if (l._id === currentImageId) {
            console.log(l)
            cName += ` ${Styles.current}`
        }

        return (
            <Box className={cName} key={`${l.url}-${l.title}`}>
                <Image
                    className={Styles.image_thumbnail}
                    src={l.url} alt={l.title} fill={true}
                />
            </Box>
        )
    })

    return (
        <Flex gap={14}>
            {imageList}
        </Flex>
    )
}