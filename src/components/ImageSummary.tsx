'use client'

import { Button, Flex, Text, TextInput } from "@mantine/core"
import { useEffect, useRef, useState } from "react";
import Styles from '@/styles/components/imageDetails.module.css';

export default function ImageSummary(
    {
        username, title, description, 
        updateImageTitleAndDescription,
    } : 
    {
        username: string, title: string, description: string,
        updateImageTitleAndDescription: (new_title: string, new_description: string) => Promise<void>, 
    }
) {
    const [_title, set_Title] = useState<string>(title)
    const [_description, set_Description] = useState<string>(description)
    const [editing, setEditing] = useState(false);
    const summaryRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (summaryRef.current && !summaryRef.current.contains(event.target as Node)) {
            setEditing(false);
        }
    };

    const requestUpdate = async () => {
        try {
            await updateImageTitleAndDescription(_title, _description)
        } catch(e) {
            alert((e as Error).message);
        } finally {
            setEditing(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <Flex 
            direction='column' 
            gap={8} 
            className={Styles.image_summary} 
            id="image_summary"
            ref={summaryRef}
        >
            <Text fw={700}>{username}</Text>
            <Flex onClick={() => setEditing(true)} direction='column' gap={8}>
                {
                    editing ? (
                        <>
                            <TextInput
                                placeholder="제목 입력"
                                value={_title}
                                onChange={e => set_Title(e.target.value)}
                            />
                            <TextInput
                                placeholder="상세 정보 입력"
                                value={_description}
                                onChange={e => set_Description(e.target.value)}
                            />
                            <Button className={Styles.edit_done_btn} onClick={requestUpdate}>완료</Button>
                        </>
                    ) : (
                        <>
                            <Text fw={500}>{title}</Text>
                            <Text>{description}</Text>
                        </>
                    )
                }

            </Flex>
        </Flex>
    )
}
