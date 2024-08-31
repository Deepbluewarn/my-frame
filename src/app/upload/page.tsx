'use client'

import Uploader from "@/components/Uploader";
import Styles from '../../styles/upload.module.css';
import { Box, Paper } from "@mantine/core";
import ImageMetadataEditor from "@/components/ImageMetadataEditor";
import { UploadProvider } from "@/context/UploadContext";

export default function Upload() {
    return (
        <UploadProvider>
            <Box className={Styles.container}>
                <Paper className={Styles.sidebar} withBorder>
                    <ImageMetadataEditor />
                </Paper>
                <Paper className={Styles.main}>
                    <Uploader />
                </Paper>
            </Box>
        </UploadProvider>
    )
}
