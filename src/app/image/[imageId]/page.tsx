import Styles from '@/styles/components/imageDetails.module.css';
import { Box } from "@mantine/core";
import { actionGetSurroundingImagesById } from "@/actions/image";
import ImageDetails from "@/components/ImageDetail/ImageDetail";
import { notFound } from 'next/navigation';
import { isValidObjectId } from 'mongoose';
import { ImageDetailStoreProvider } from '@/providers/image-detail-store-provider';

export default async function Page({ params }: { params: { imageId: string } }) {
    let THUMBNAIL_LIST_RADIUS: number = parseInt(process.env.NEXT_PUBLIC_THUMBNAIL_LIST_RADIUS || '3', 10);

    // objectId 유효성 확인
    if (!isValidObjectId(params.imageId)) {
        notFound()
    }

    const images = await actionGetSurroundingImagesById(params.imageId, THUMBNAIL_LIST_RADIUS + 1);

    if (!images || images.length === 0) notFound();

    return (
        <ImageDetailStoreProvider value={{ imageId: params.imageId, images }} >
            <Box className={Styles.container}>
                <ImageDetails />
            </Box>
        </ImageDetailStoreProvider>
    )
}
