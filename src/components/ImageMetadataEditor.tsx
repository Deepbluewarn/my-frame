'use client'

import { ImageInterface, UploadContext } from '@/app/upload/page';
import { Text, TextInput } from '@mantine/core';
import React, { useContext } from 'react';

function findImageFile(targetFileKey: string, images: ImageInterface[]) {
    return images.find(e => e.key === targetFileKey);
}
export default function ImageMetadataEditor() {
    const uploadContext = useContext(UploadContext);
    const { selectedFileKey, imageFiles, setImageFiles } = uploadContext;

    if (!imageFiles || selectedFileKey === null) {
        return <Text>이미지를 선택하세요</Text>
    }

    const image = findImageFile(selectedFileKey, imageFiles)

    const onImageNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget;

        setImageFiles(v => {
            if(!v) return v;

            return v.map(e => {
                e.name = e.key === selectedFileKey ? target.value : e.name;
                return e;
            })
        })
    }

    const onImageTagChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget;

        setImageFiles(v => {
            if(!v) return v;

            return v.map(e => {
                e.tags = e.key === selectedFileKey ? target.value.split(' ') : e.tags;
                return e;
            })
        })
    }

    if (!image) {
        return <Text>이미지를 선택하세요</Text>
    }

    return (
        <>
            <Text variant="">이미지 설정</Text>

            <Text>{image.name === '' ? '이름 추가' : image.name}</Text>

            <TextInput
                label="이름"
                description="이름을 입력하세요"
                placeholder="이름"
                value={image.name}
                onChange={onImageNameChanged}
            />

            <TextInput
                label="태그"
                description="태그를 입력하세요 (공백으로 구분)"
                placeholder="태그"
                value={image.tags.join(' ')}
                onChange={onImageTagChanged}
            />
        </>
    )
}
