'use client'

import { UploadAction } from "@/actions/upload/upload";
import { UploadContext } from "@/context/UploadContext";
import React, { useContext } from "react";
import { ImageInterface } from "@/interface/Upload";
import { hashFile, readFile } from "@/utils/file";
import ImageFrame from "./ImageFrame";

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
                <input type="file" name="file" 
                    accept="image/*"
                    multiple onChange={onFileChanged} />
                <input type="submit" value="Upload" />
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {
                    uploadContext.imageFiles?.map(e => <ImageFrame key={e.key} image={e} />)
                }
            </div>
        </>
    )
}