'use client'

import { UploadContext } from '@/context/UploadContext';
import { ImageInterface } from '@/interface/Upload';
import { Box, Text, TextInput } from '@mantine/core';
import React, { useContext, useState } from 'react';
import Styles from '@/styles/components/ImageMetadataEditor.module.css'
import PotatoChip from './PotatoChip';

function findImageFile(targetFileKey: string, images: ImageInterface[]) {
    return images.find(e => e.key === targetFileKey);
}
export default function ImageMetadataEditor() {
    const uploadContext = useContext(UploadContext);
    const { selectedFileKey, imageFiles, updateName, addTags, removeTag } = uploadContext;
    const [inputTagStr, setInputTagStr] = useState('');

    if (!imageFiles || selectedFileKey === null) {
        return <Text>이미지를 선택하세요</Text>
    }

    const image = findImageFile(selectedFileKey, imageFiles)

    const onImageNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        
        updateName(selectedFileKey, target.value);
    }

    const onImageTagEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;

        const target = e.currentTarget;
        const newTags = target.value.split(' ');

        addTags(selectedFileKey, newTags);
        setInputTagStr('');
    }

    const onTagRemoveClicked = (content: string) => {
        removeTag(selectedFileKey, content);
    }

    if (!image) {
        return <Text>이미지를 선택하세요</Text>
    }

    return (
        <>
            <Text variant="">사진 편집</Text>

            <Text className={Styles.imageTitle} variant='bold' size="lg">
                {image.name === '' ? '이름 추가' : image.name}
            </Text>

            <Text
                size="xl"
                fw={900}
                variant="gradient"
                className={Styles.title}
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            >
                이름
            </Text>
            <TextInput
                description="이름을 입력하세요"
                placeholder="이름"
                value={image.name}
                onChange={onImageNameChanged}
            />

            <Text
                size="xl"
                fw={900}
                variant="gradient"
                className={Styles.title}
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            >
                태그
            </Text>
            <Box className={Styles.chip_container}>
                {
                    Array.from(image.tags).map(e => {
                        return <PotatoChip key={e} content={e} onRemoveClick={onTagRemoveClicked} />
                    })
                }
            </Box>

            <TextInput
                description="태그를 입력하세요 (공백으로 구분)"
                placeholder="태그"
                value={inputTagStr}
                onChange={(e) => setInputTagStr(e.target.value)}
                onKeyDown={onImageTagEnter}
            />
        </>
    )
}
