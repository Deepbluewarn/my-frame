'use client'

import { useEffect } from 'react';
import Styles from '@/styles/components/imageDetails.module.css';
import {
    Box, Divider, Flex,
} from "@mantine/core";
import LikeList from "./ImageLikeList";
import { useImageDetailStore } from "@/providers/image-detail-store-provider";
import ImageViewer from "./ImageViewer";
import ImageInfo from "./ImageInfo";
import ImageTags from "./ImageTags";
import ImageComments from "./ImageComments";
import ImageAttributes from './ImageAttributes';

export default function ImageDetails() {
    const setCurrentImageId = useImageDetailStore(store => store.actions.common.setId);

    useEffect(() => {
        const handlePopState = () => {
            const id = window.location.pathname.split('/').pop();
            if (id) {
                setCurrentImageId(id);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);
    
    return (
        <Box className={Styles.container}>
            <ImageViewer />
            <Flex className={Styles.detail_container}>
                <Flex direction='column' flex='1' className={Styles.detail_left}>
                    <ImageInfo />
                    <Divider className={Styles.list_divider} />
                    <ImageTags />
                    <Divider className={Styles.list_divider} />
                    <LikeList />
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
