'use client'

import { UploadAction } from "@/actions/upload/upload";
import { UploadContext } from "@/context/UploadContext";
import React, { useContext } from "react";
import { ImageInterface } from "@/interface/Upload";
import { hashFile, formatFileSize } from "@/utils/file";
import ImageFrame from "./ImageFrame";
import Styles from '@/styles/components/Uploader.module.css';
import { Button, Paper } from "@mantine/core";

export default function Uploader() {
    const uploadContext = useContext(UploadContext);

    const onFileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;

        if (!files) return;

        if (files.length === 0) return;

        const Images = Array.from(files).map((e): ImageInterface => {
            return {
                key: hashFile(e),
                objectURL: URL.createObjectURL(e),
                name: e.name,
                tags: new Set(),
                size: formatFileSize(e.size),
            }
        })

        uploadContext.setImageFiles(old => {
            if (!old) return Images;

            Images.forEach(e => {
                if (old.some(f => f.key === e.key)) return;

                old.push(e);
            })

            return [...old];
        });
    };

    const imageClicked = (e: React.MouseEvent, imageKey: string) => {
        const target = e.target as HTMLElement;

        if (target.closest('button')) {
            uploadContext.setImageFiles(old => {
                if (!old) return old;

                return old.filter(e => e.key !== imageKey);
            });

            if (uploadContext.selectedFileKey === imageKey) {
                uploadContext.setSelectedFileKey('');
            }
        } else {
            uploadContext.setSelectedFileKey(imageKey);
        }
    }

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
                        <div key={e.key} onClick={(ev) => imageClicked(ev, e.key)}>
                            <ImageFrame
                                selected={e.key === uploadContext.selectedFileKey}
                                imageKey={e.key}
                                objectURL={e.objectURL}
                                imageName={e.name}
                                size={e.size}
                            />
                        </div>
                    )
                }
            </div>
        </>
    )
}