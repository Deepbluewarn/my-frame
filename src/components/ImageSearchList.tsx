'use client'

import { SearchResult } from "@/services/types";
import { useEffect, useState } from "react";
import { Box, Flex, Group, Pagination, Stack, Text } from '@mantine/core';
import { actionSearchImages } from "@/actions/image";
import { ImageInterface } from "@/db/models/Image";
import GalleryComponent from "./Gallery";

export default function ImageSearchList({ query } : { query: string }) {
    const [images, setImages] = useState<SearchResult<ImageInterface>>();
    const [page, setPage] = useState(1);

    useEffect(() => {
        const asyncFn = async () => {
            const images = await actionSearchImages(query);
            setImages(images);
        }
        asyncFn();
    }, [])

    if (!images) {
        return null;
    }

    if (images.totalCount <= 0) {
        return <Text>{images.totalCount}건의 사진 검색 결과</Text>
    }

    return (
        images.totalCount > 0 ? (
            <Stack>
                <Text>{images.totalCount}건의 사진 검색 결과</Text>
                <GalleryComponent images={images.results} />
                <Pagination value={page} onChange={setPage} total={images.totalPages} />
            </Stack>
        ) : null
    )
}
