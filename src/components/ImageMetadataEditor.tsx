'use client'

import { ImageInterface, UploadContext } from '@/app/upload/page';
import { Text, TextInput } from '@mantine/core';
import React, { useContext } from 'react';

function findImageFile(targetFileName: string, images: ImageInterface[]) {
    return images.find(e => e.name === targetFileName);
}
export default function ImageMetadataEditor() {
    const uploadContext = useContext(UploadContext);
    const selectedFile = uploadContext.selectedFile;

    if (!uploadContext.imageFiles || selectedFile === null) {
        return <Text>이미지를 선택하세요</Text>
    }

    const image = findImageFile(selectedFile.name, uploadContext.imageFiles)

    const onImageNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget;

        uploadContext.setImageFiles(v => {
            if(!v) return v;

            const img = findImageFile(selectedFile.name, v);

            if(!img) return v;

            img.name = target.value;

            return v;
        })
    }

    const onImageTagChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget;

        uploadContext.setImageFiles(v => {
            if(!v) return v;

            const img = findImageFile(selectedFile.name, v);

            if(!img) return v;

            img.tags = target.value.split(' ');

            return v;
        })
    }

    if (!image) {
        return <Text>이미지를 선택하세요</Text>
    }

    return (
        <>
            <Text variant="">이미지 설정</Text>

            <Text>{image.name}</Text>

            <TextInput
                label="이름"
                description="사진의 이름을 입력하세요"
                placeholder="이름"
                value={image.name}
                onChange={onImageNameChanged}
            />

            <TextInput
                label="태그"
                description="사진을 위한 태그를 입력하세요"
                placeholder="태그"
                value={image.tags.join(' ')}
                onChange={onImageTagChanged}
            />


        </>
    )
}
