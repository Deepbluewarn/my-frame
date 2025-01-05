import { Box, Flex, Text } from "@mantine/core";
import Image from "next/image";
import Styles from '@/styles/components/ImageThumbnail.module.css';
import { ImageWithOwner } from "@/services/Image";

export default function ImageThumbnail(
    { image, size = 30, current, selected, onThumbnailClick }:
    {
        image: ImageWithOwner | undefined,
        current?: boolean, 
        selected?: boolean,
        size?: number, 
        onThumbnailClick?: (image?: ImageWithOwner) => void,
    }
) {
    if (!image) {
        return null;
    }

    let cName = `${Styles.image_wrapper}`

    if (current) {
        cName += ` ${Styles.current}`
    }
    return (
        <Flex
            className={cName}
            key={`${image.url}-${image.title}`}
            style={{ minWidth: `${size}px`, minHeight: `${size}px` }}
            onClick={() => {
                onThumbnailClick ? onThumbnailClick(image) : null
            }}
        >
            <Box className={Styles.overlay_container}>
                {selected ? (
                    <Flex style={{ height: '100%' }} justify='center' align='center'>
                        <Text component='span'>선택 됨</Text>
                    </Flex>
                ) : null}
            </Box>
            <Image
                className={Styles.image_thumbnail}
                src={image.url} alt={image.title} fill={true}
            />
        </Flex>
    )
}
