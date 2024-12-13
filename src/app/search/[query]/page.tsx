import UserSearchList from '@/components/UserSearchList';
import { Stack, Text } from '@mantine/core';
import Styles from '@/styles/home.module.css'
import ImageSearchList from '@/components/ImageSearchList';

export default async function SearchResult({ params }: { params: { query: string } }) {
    return (
        <Stack className={Styles.content}>
            <Text fw={700} size="xl">"{decodeURI(params.query)}" 검색 결과</Text>
            <ImageSearchList query={params.query} />
            <UserSearchList query={params.query}/>
        </Stack>
    )
}
