'use client'

import { UploadAction } from "@/actions/upload/upload";
import { UploadContext } from "@/context/UploadContext";
import React, { useContext, useState } from "react";
import { Text } from '@mantine/core'
import { ImageInterface } from "@/interface/Upload";
import { hashFile, readFile } from "@/utils/file";

function AsyncImageFrame({ image } : { image: ImageInterface }) {
    const uploadContext = useContext(UploadContext);

    const [ solvedUrl, setSolvedUrl ] = useState('');
    const [ loading, setLoading ] = useState(true);

    image.url.then(s => {
        setSolvedUrl(s)
        setLoading(false)
    })

    const handleImageClick = (image_key: string) => {
        uploadContext.setSelectedFileKey(image_key);
    }

    return loading ? <Text>로딩 중..</Text> : (
        <img
            key={image.key}
            src={solvedUrl}
            alt={image.name}
            style={{ flex: '1 1 auto', maxWidth: '200px', height: 'auto' }}
            onClick={() => handleImageClick(image.key)}
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
                key: hashFile(e),
                object: e,
                name: e.name,
                tags: new Set(),
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
                    uploadContext.imageFiles?.map(e => <AsyncImageFrame key={e.key} image={e} />)
                }
            </div>
        </>
    )
}