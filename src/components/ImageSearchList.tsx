'use client'

import { SearchResult } from "@/services/types";
import { useEffect, useState } from "react";
import { Pagination, Stack, Text } from '@mantine/core';
import { actionSearchImages } from "@/actions/image";
import GalleryComponent from "./Gallery";
import { ImageWithOwner } from "@/services/Image";

export default function ImageSearchList({ query } : { query: string }) {
    const [images, setImages] = useState<SearchResult<ImageWithOwner>>();
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
