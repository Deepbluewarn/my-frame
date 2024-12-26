'use client'

import { TextInput } from "@mantine/core"
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
    const icon = <IconSearch style={{ width: '1.5rem', height: '1.5rem' }} />;
    const [query, setQuery] = useState('');
    const router = useRouter();
    
    const onKeyUpEvent = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        const key = ev.key;

        if (key === 'Enter' && query !== '') {
            router.push(`/search/${encodeURIComponent(query)}`);
        }
    }
    return (
        <TextInput
            leftSectionPointerEvents="none"
            leftSection={icon}
            aria-label="검색"
            onChange={(e) => setQuery(e.currentTarget.value)}
            onKeyUp={onKeyUpEvent}
            placeholder="검색"
        />
    )
}
