'use client'

import { Button, Flex, Text, TextInput } from "@mantine/core"
import { useEffect, useRef, useState } from "react";
import Styles from '@/styles/components/imageDetails.module.css';
import { useImageDetailStore } from "@/providers/image-detail-store-provider";

export default function ImageSummary() {
    const currentImage = useImageDetailStore(store => store.currentImage);
    const ImageStoreActions = useImageDetailStore(store => store.actions);
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [editing, setEditing] = useState(false);
    const summaryRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (summaryRef.current && !summaryRef.current.contains(event.target as Node)) {
            setEditing(false);
        }
    };

    const requestUpdate = async () => {
        if (!currentImage) {
            return;
        }
        
        try {
            if (title !== currentImage.title) {
                await ImageStoreActions.title.update(title);
            }
            if (description !== currentImage.description) {
                await ImageStoreActions.description.update(description);
            }
        } catch(e) {
            alert((e as Error).message);
        } finally {
            setEditing(false)
        }
    }

    useEffect(() => {
        setTitle(currentImage?.title || '');
        setDescription(currentImage?.description || '')
    }, [currentImage?.title, currentImage?.description])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    if (!currentImage) {
        return null;
    }
    
    return (
        <Flex 
            direction='column' 
            gap={8} 
            className={Styles.image_summary} 
            id="image_summary"
            ref={summaryRef}
        >
            <Flex onClick={() => setEditing(true)} direction='column' gap={8}>
                {
                    editing ? (
                        <>
                            <TextInput
                                placeholder="제목 입력"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                            <TextInput
                                placeholder="상세 정보 입력"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                            <Button className={Styles.edit_done_btn} onClick={requestUpdate}>완료</Button>
                        </>
                    ) : (
                        <>
                            <Text fw={500}>{currentImage.title}</Text>
                            <Text>{currentImage.description}</Text>
                        </>
                    )
                }

            </Flex>
        </Flex>
    )
}
