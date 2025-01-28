'use client'

import { useEffect } from 'react';
import Styles from '@/styles/components/imageDetails.module.css';
import {
    Box, Divider, Flex,
} from "@mantine/core";
import StarList from "./ImageLikeList";
import { useImageDetailStore } from "@/providers/image-detail-store-provider";
import ImageViewer from "./ImageViewer";
import ImageInfo from "./ImageInfo";
import ImageTags from "./ImageTags";
import ImageComments from "./ImageComments";
import ImageAttributes from './ImageAttributes';
import { usePathname } from 'next/navigation';

export default function ImageDetails() {
    const ImageStore = useImageDetailStore(store => store);
    const pathname = usePathname();

    useEffect(() => {
        const path = decodeURI(pathname);
        const id = path.split('/')[2];
        ImageStore.actions.common.setId(id);
    }, [pathname])

    useEffect(() => {
        ImageStore.actions.common.init();
    }, [])

    if (!ImageStore.currentImage) {
        return null;
    }

    return (
        <Box className={Styles.container}>
            <ImageViewer />
            <Flex className={Styles.detail_container}>
                <Flex direction='column' flex='1' className={Styles.detail_left}>
                    <ImageInfo />
                    <Divider className={Styles.list_divider} />
                    <ImageTags />
                    <Divider className={Styles.list_divider} />
                    <StarList />
                    <Divider className={Styles.list_divider} />
                    <ImageComments />
                </Flex>
                <Flex direction='column' flex='1' className={Styles.detail_right}>
                    <ImageAttributes />
                </Flex>
            </Flex>
        </Box>
    )
}
