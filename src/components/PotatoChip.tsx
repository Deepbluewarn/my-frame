import { Box, Button, Text, useMantineTheme } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import Styles from '@/styles/components/PotatoChip.module.css'
import React from "react";

interface PotatoChipProps {
    content: string;
    onRemoveClick?: (content: string) => void;
}
export default function PotatoChip({ content, onRemoveClick } : PotatoChipProps) {
    const theme = useMantineTheme();

    return (
        <Box className={Styles.container} style={{
            backgroundColor: theme.colors.blue[5],
            color: theme.white
        }}>
            <Text className={Styles.content}>{content}</Text>
            <Button className={Styles.remove_btn} onClick={e => onRemoveClick && onRemoveClick(content)}>
                <IconX />
            </Button>
        </Box>
    )
}
