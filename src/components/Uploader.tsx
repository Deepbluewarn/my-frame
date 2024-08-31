'use client'

import { UploadAction } from "@/actions/upload/upload";
import { UploadContext } from "@/context/UploadContext";
import React, { useContext } from "react";
import { ImageInterface } from "@/interface/Upload";
import { hashFile, readFile } from "@/utils/file";
import ImageFrame from "./ImageFrame";
import Styles from '@/styles/components/Uploader.module.css';
import { Button, Paper } from "@mantine/core";

export default function Uploader() {
    const uploadContext = useContext(UploadContext);

    const onFileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;

        if (!files) return;

        const Images = Array.from(files).map(e => {
            return {
                key: hashFile(e),
                objectURL: URL.createObjectURL(e),
                name: e.name,
                tags: new Set(),
            } as ImageInterface
        })

        uploadContext.setImageFiles(Images);
    };

    return (
        <>
            <Paper className={Styles.formContainer} withBorder>
                <form action={UploadAction} className={Styles.form}>
                    <input
                        type="file"
                        name="file"
                        id="selectFile"
                        accept="image/*"
                        multiple
                        onChange={onFileChanged}
                        className={Styles.fileInput}
                    />
                    <input
                        type="submit"
                        id="submit_files"
                        className={Styles.fileInput}
                    />
                    <Button 
                        component='label'
                        htmlFor="selectFile" 
                    >
                        사진 선택
                    </Button>
                    {
                        uploadContext.imageFiles ? (
                            <Button
                                component='label'
                                htmlFor="submit_files"
                            >
                                {`${uploadContext.imageFiles.length}개 업로드`}
                            </Button>
                        ) : null
                    }
                </form>
            </Paper>


            <div className={Styles.imageFrameContainer}>
                {
                    uploadContext.imageFiles?.map(e => 
                        <div key={e.key} onClick={() => uploadContext.setSelectedFileKey(e.key)}>
                            <ImageFrame
                                selected={e.key === uploadContext.selectedFileKey}
                                imageKey={e.key}
                                objectURL={e.objectURL}
                                imageName={e.name}
                            />
                        </div>
                    )
                }
            </div>
        </>
    )
}