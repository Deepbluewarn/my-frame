'use client'

import { UploadContext } from '@/context/UploadContext';
import { ImageInterface } from '@/interface/Upload';
import { Box, Chip, Flex, Group, Text, TextInput } from '@mantine/core';
import React, { useContext, useState } from 'react';
import Styles from '@/styles/components/ImageMetadataEditor.module.css'
import PotatoChip from './PotatoChip';
import { Visibility } from '@/db/models/Image';

function findImageFile(targetFileKey: string, images: ImageInterface[]) {
    return images.find(e => e.key === targetFileKey);
}
export default function ImageMetadataEditor() {
    const uploadContext = useContext(UploadContext);
    const { 
        selectedFileKey, imageFiles, 
        updateName, addTags, removeTag, 
        updateDescription, updateVisibility,
    } = uploadContext;
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

    const onChipChanged = (value: string) => {
        updateVisibility(selectedFileKey, value as Visibility);
    }

    const onImageDescriptionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        updateDescription(selectedFileKey, target.value);
    }

    if (!image) {
        return <Text>이미지를 선택하세요</Text>
    }

    return (
        <>
            <Text
                size="xl"
                fw={900}
                variant="gradient"
                className={Styles.title}
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            >
                사진 편집
            </Text>

            <Text
                size="sm"
                fw={900}
                className={Styles.title}
            >
                이름
            </Text>
            <TextInput
                description="사진의 이름을 입력하세요"
                placeholder="이름"
                value={image.name}
                onChange={onImageNameChanged}
            />

            <Text
                size="sm"
                fw={900}
                className={Styles.title}
            >
                설명
            </Text>

            <TextInput
                description="사진에 대한 설명"
                placeholder="설명"
                value={image.description}
                onChange={onImageDescriptionChanged}
            />

            <Text
                size="sm"
                fw={900}
                className={Styles.title}
            >
                태그
            </Text>
            {
                image.tags.size === 0 ? null : (
                    <Box className={Styles.chip_container}>
                        {
                            Array.from(image.tags).map(e => {
                                return <PotatoChip key={e} content={e} onRemoveClick={onTagRemoveClicked} />
                            })
                        }
                    </Box>
                )
            }

            <TextInput
                description="태그를 입력하세요 (공백으로 구분)"
                placeholder="태그"
                value={inputTagStr}
                onChange={(e) => setInputTagStr(e.target.value)}
                onKeyDown={onImageTagEnter}
            />

            <Text
                size="sm"
                fw={900}
                className={Styles.title}
            >
                공개 범위
            </Text>

            <Flex gap={2}>
                <Chip.Group multiple={false} value={image.visibility} onChange={onChipChanged}>
                    <Group>
                        <Chip value="public">
                            전체 공개
                        </Chip>
                        <Chip value="follow">
                            친구 공개
                        </Chip>
                        <Chip value="private">
                            비공개
                        </Chip>
                    </Group>
                </Chip.Group>
            </Flex>
        </>
    )
}
