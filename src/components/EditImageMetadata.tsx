'use client'

import { ImageWithOwner } from "@/services/Image";
import { Button, Chip, Flex, Group, Paper, Pill, PillGroup, PillsInput, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { Visibility } from "@/db/models/Image";
import { actionUpdateImagesMetadata } from "@/actions/image";

export default function EditImageMetadata(
    {
        selectedImages, done
    }: 
    {
        selectedImages: ImageWithOwner[], done: (refresh?: boolean) => void,
    }
) {
    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [tagStrInput, setTagStrInput] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [visibility, setVisibility] = useState<Visibility>();
    const isMultiple = selectedImages.length > 1;

    useEffect(() => {
        if (!selectedImages[0]) {
            return;
        }
        setTitle(selectedImages[0].title);
        setDescription(selectedImages[0].description);
    }, [])

    const onImageTagEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;

        const target = e.currentTarget;

        addTags(target.value.split(' '));
        setTagStrInput('');
    }

    const addTags = (tags: string[]) => {
        setTags(prev => {
            const tagSet = new Set(prev);
            tags.forEach(t => tagSet.add(t));

            return Array.from(tagSet);
        })
    }

    const removeTag = (tag: string) => {
        setTags(prev => {
            const tags = [...prev];

            tags.splice(tags.indexOf(tag), 1);
            return tags;
        })
    }

    const changeVisibility = (visibility: Visibility) => {
        setVisibility(visibility)
    }

    const updateMetadata = async () => {
        const res = await actionUpdateImagesMetadata(
            selectedImages.map(i => i._id),
            title, description, tags, visibility
        )

        if (res) {
            alert('사진을 성공적으로 업데이트했습니다.')
            done(true);
        }
    }

    return (
        <Flex direction='column' gap={16}>
            <Text>{selectedImages.length}개의 사진을 편집합니다.</Text>

            <Paper withBorder p={8}>
                <Flex direction='column' gap={8}>
                    <TextInput
                        value={title}
                        onChange={(event) => setTitle(event.currentTarget.value)}
                        placeholder={isMultiple ? '제목 일괄 수정' : '제목 수정'}
                    />
                    <TextInput
                        value={description}
                        onChange={(event) => setDescription(event.currentTarget.value)}
                        placeholder={isMultiple ? '설명 일괄 수정' : '설명 수정'}
                    />
                </Flex>
            </Paper>

            <PillsInput label="태그">
                <PillGroup>
                    {
                        tags.map(tag =>
                            <Pill
                                withRemoveButton
                                onRemove={() => removeTag(tag)}
                                key={tag}
                            >
                                {tag}
                            </Pill>
                        )
                    }
                    <PillsInput.Field
                        value={tagStrInput}
                        onChange={(e) => { setTagStrInput(e.target.value) }}
                        onKeyDown={onImageTagEnter}
                        placeholder="태그 추가 (공백으로 구분)"
                    />
                </PillGroup>
            </PillsInput>

            <Text>접근 범위 설정</Text>

            <Chip.Group multiple={false} value={visibility} onChange={(value) => {changeVisibility(value as Visibility)}}>
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

            <Flex justify='flex-end' gap={16}>
                <Button onClick={() => done()} color="gray">취소</Button>
                <Button onClick={() => updateMetadata()}>저장</Button>
            </Flex>
        </Flex>
    )
}
