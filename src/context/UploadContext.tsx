import { Visibility } from "@/db/models/Image";
import { ImageInterface } from "@/interface/Upload";
import React, { createContext, Dispatch, SetStateAction, useState } from "react";

interface UploadContext {
    imageObjects: ImageInterface[] | null,
    setImageObjects: Dispatch<SetStateAction<ImageInterface[] | null>>
    selectedFileKey: string | null
    setSelectedFileKey: Dispatch<SetStateAction<string | null>>
    addTags: (fileKey: string, newTags: string[]) => void
    removeTag: (fileKey: string, targetTag: string) => void
    updateName: (fileKey: string, newName: string) => void,
    updateDescription: (fileKey: string, value: string) => void,
    updateVisibility: (fileKey: string, value: Visibility) => void,
}

const defaultUploadContext: UploadContext = {
    imageObjects: null,
    setImageObjects: () => {},
    selectedFileKey: null,
    setSelectedFileKey: () => {},
    addTags: () => {},
    removeTag: () => {},
    updateName: () => {},
    updateDescription: () => {},
    updateVisibility: () => {},
};

export const UploadContext = createContext(defaultUploadContext);

export const UploadProvider = ({children}: {children: React.ReactNode}) => {
    const [imageObjects, setImageObjects] = useState<ImageInterface[] | null>(null);
    const [selectedFileKey, setSelectedFileKey] = useState<string | null>(null); // 파일 이름으로 선택

    const updateImageFiles = (update: (newValues: ImageInterface[]) => ImageInterface[]) => {
        setImageObjects(prev => {
            if (!prev) return prev;

            return update(prev);
        })
    }

    const updateName = (fileKey: string, newName: string) => {
        updateImageFiles((newValue) => {
            return newValue.map(e=> {
                e.name = e.key === fileKey ? newName : e.name

                return e;
            })
        })
    }
    const addTags = (fileKey: string, newTags: string[]) => {
        updateImageFiles((newValue) => {
            return newValue.map(e=> {
                if (e.key !== fileKey) return e;

                const currentTags = new Set(e.tags);
                for (const t of newTags) {
                    currentTags.add(t);
                }
                e.tags = currentTags;

                return e;
            })
        })
    }

    const removeTag = (fileKey: string, targetTag: string) => {
        updateImageFiles((newValue) => {
            return newValue.map(e=> {
                if (e.key !== fileKey) return e;

                const newTags = new Set(e.tags);
                newTags.delete(targetTag)
                e.tags = newTags;

                return e;
            })
        })
    }

    const updateDescription = (fileKey: string, newDescription: string) => {
        updateImageFiles((newValue) => {
            return newValue.map(e=> {
                if (e.key !== fileKey) return e;

                e.description = e.key === fileKey ? newDescription : e.description;

                return e;
            })
        })
    };
    const updateVisibility = (fileKey: string, newVisibility: Visibility) => {
        updateImageFiles((newValue) => {
            return newValue.map(e=> {
                if (e.key !== fileKey) return e;

                e.visibility = e.key === fileKey ? newVisibility : e.visibility;

                return e;
            })
        })
    }

    const context: UploadContext = {
        imageObjects, setImageObjects,
        selectedFileKey, setSelectedFileKey,
        addTags, removeTag, updateName,
        updateDescription, updateVisibility
    }

    return (
        <UploadContext.Provider value={context}>
            {children}
        </UploadContext.Provider>
    )
}
