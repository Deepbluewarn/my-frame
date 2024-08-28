'use client'

import { UploadAction } from "@/actions/upload/upload";
import { UploadContext } from "@/app/upload/page";
import React, { useContext, useEffect, useState } from "react";
import { Text } from '@mantine/core'
import { ImageInterface } from '@/app/upload/page';
import { readFile } from "@/utils/file";

function AsyncImageFrame({ image } : { image: ImageInterface }) {
    const uploadContext = useContext(UploadContext);

    const [ solvedUrl, setSolvedUrl ] = useState('');
    const [ loading, setLoading ] = useState(true);

    image.url.then(s => {
        setSolvedUrl(s)
        setLoading(false)
    })

    const handleImageClick = (image: ImageInterface) => {
        uploadContext.setSelectedFile(image);
    }

    return loading ? <Text>로딩 중..</Text> : (
        <img
            key={image.name}
            src={solvedUrl}
            alt={image.name}
            style={{ flex: '1 1 auto', maxWidth: '200px', height: 'auto' }}
            onClick={() => handleImageClick(image)}
        />
    )
}

export default function Uploader() {
    const uploadContext = useContext(UploadContext);

    const onFileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;

        if (!files) return;

        const Images = Array.from(files).map(e => {
            return {
                object: e,
                name: e.name,
                tags: [],
                url: readFile(e)
            } as ImageInterface
        })

        uploadContext.setImageFiles(Images);
    };

    return (
        <>
            <form action={UploadAction}>
                <input type="file" name="file" multiple onChange={onFileChanged} />
                <input type="submit" value="Upload" />
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {
                    uploadContext.imageFiles?.map(e => <AsyncImageFrame image={e} />)
                }
            </div>
        </>
    )
}