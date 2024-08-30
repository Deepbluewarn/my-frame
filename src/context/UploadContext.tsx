import { ImageInterface } from "@/interface/Upload";
import React, { createContext, Dispatch, SetStateAction, useState } from "react";

interface UploadContext {
    imageFiles: ImageInterface[] | null,
    setImageFiles: Dispatch<SetStateAction<ImageInterface[] | null>>
    selectedFileKey: string | null
    setSelectedFileKey: Dispatch<SetStateAction<string | null>>
    addTags: (fileKey: string, newTags: string[]) => void
    removeTag: (fileKey: string, targetTag: string) => void
    updateName: (fileKey: string, newName: string) => void,
}

const defaultUploadContext: UploadContext = {
    imageFiles: null,
    setImageFiles: () => {},
    selectedFileKey: null,
    setSelectedFileKey: () => {},
    addTags: () => {},
    removeTag: () => {},
    updateName: () => {},
};

export const UploadContext = createContext(defaultUploadContext);

export const UploadProvider = ({children}: {children: React.ReactNode}) => {
    const [imageFiles, setImageFiles] = useState<ImageInterface[] | null>(null);
    const [selectedFileKey, setSelectedFileKey] = useState<string | null>(null); // 파일 이름으로 선택

    const updateName = (fileKey: string, newName: string) => {
        setImageFiles(prev => {
            if (!prev) return prev;

            prev = prev.map(e=> {
                e.name = e.key === fileKey ? newName : e.name

                return e;
            })

            return prev;
        })
    }
    const addTags = (fileKey: string, newTags: string[]) => {
        setImageFiles(prev => {
            if (!prev) return prev;

            prev = prev.map(e=> {
                if (e.key !== fileKey) return e;

                const currentTags = new Set(e.tags);
                for (const t of newTags) {
                    currentTags.add(t);
                }
                e.tags = currentTags;

                return e;
            })

            return prev;
        })
    }

    const removeTag = (fileKey: string, targetTag: string) => {
        setImageFiles(prev => {
            if (!prev) return prev;

            prev = prev.map(e=> {
                if (e.key !== fileKey) return e;

                const newTags = new Set(e.tags);
                newTags.delete(targetTag)
                e.tags = newTags;

                return e;
            })

            return prev;
        })
    }

    const context: UploadContext = {
        imageFiles, setImageFiles,
        selectedFileKey, setSelectedFileKey,
        addTags, removeTag, updateName,
    }

    return (
        <UploadContext.Provider value={context}>
            {children}
        </UploadContext.Provider>
    )
}
