'use client'

import Uploader from "@/components/Uploader";
import Styles from '../../styles/upload.module.css';
import { Box } from "@mantine/core";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import ImageMetadataEditor from "@/components/ImageMetadataEditor";

export interface ImageInterface {
    object: File;
    key: string; // 파일을 찾을 때 사용하는 속성
    name: string; // 사용자가 지정한 파일의 이름
    tags: string[]; // 사용자가 입력한 태그 목록
    url: Promise<string>; // base64로 인코딩된 이미지 파일
}

interface UploadContext {
    imageFiles: ImageInterface[] | null,
    setImageFiles: Dispatch<SetStateAction<ImageInterface[] | null>>
    selectedFileKey: string | null
    setSelectedFileKey: Dispatch<SetStateAction<string | null>>
}
const defaultUploadContext = {
    imageFiles: null,
    setImageFiles: () => {},
    selectedFileKey: null,
    setSelectedFileKey: () => {},
} as UploadContext;

export const UploadContext = createContext(defaultUploadContext);

export default function Upload() {
    // 이미지 목록, 선택한 이미지를 가지는 context

    const [imageFiles, setImageFiles] = useState<ImageInterface[] | null>(null);
    const [selectedFileKey, setSelectedFileKey] = useState<string | null>(null); // 파일 이름으로 선택

    const context = {
        imageFiles, setImageFiles,
        selectedFileKey, setSelectedFileKey
    }

    return (
        <UploadContext.Provider value={context}>
            <Box className={Styles.container}>
                <aside className={Styles.sidebar}>
                    <ImageMetadataEditor />
                </aside>
                <main className={Styles.main}>
                    <Uploader />
                </main>
            </Box>
        </UploadContext.Provider>
    )
}
