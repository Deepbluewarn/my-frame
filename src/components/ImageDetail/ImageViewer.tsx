import { ActionIcon, Box, Text } from "@mantine/core";
import GalleryFrame from "../GalleryFrame";
import { IconCircleChevronLeft, IconCircleChevronRight } from "@tabler/icons-react";
import ImageThumbnailList from "./ImageThumbnailList";
import Styles from '@/styles/components/imageDetails.module.css';
import { useImageDetailStore } from "@/providers/image-detail-store-provider";
import { IGallery } from "../Gallery";

export default function ImageViewer() {
    const thumbnails = useImageDetailStore(store => store.thumbnails);
    const currentImage = useImageDetailStore(store => store.currentImage);
    const navigate = useImageDetailStore(store => store.actions.navigate);

    if (!currentImage) {
        return <Text>이미지를 찾을 수 없습니다.</Text>
    }
    const gallery: IGallery = {
        _id: currentImage._id,
        url: currentImage.url,
        title: currentImage.title,
        width: currentImage.width,
        height: currentImage.height,
        likes: currentImage.likes,
        ownerDetails: currentImage.ownerDetails,
    }
    return (
        <Box className={Styles.image_container}>
            <ActionIcon
                variant="default"
                onClick={() => { navigate('prev') }}
                className={`${Styles.nav_prev_btn} ${Styles.nav_btn}`}
            >
                <IconCircleChevronLeft />
            </ActionIcon>
            <GalleryFrame
                gallery={gallery}
                className={Styles.image}
                imageStyle={{
                    width: '100%', objectFit: 'contain',
                }}
                overlay={false}
                link={false}
            />
            <ActionIcon
                variant="default"
                onClick={() => { navigate('next') }}
                className={`${Styles.nav_next_btn} ${Styles.nav_btn}`}
            >
                <IconCircleChevronRight />
            </ActionIcon>

            <Box className={Styles.image_thumbnail_list}>
                <ImageThumbnailList list={thumbnails} currentImageId={currentImage._id} />
            </Box>
        </Box>
    )
}