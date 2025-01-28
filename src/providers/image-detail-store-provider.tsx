'use client'

import { ImageWithOwner } from "@/services/Image";
import { ImageDetailStore, createImageDetailStore } from "@/stores/image-detail-store"
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export interface InitImageDetail {
    imageId: string;
    images: ImageWithOwner[];
}
export type ImageDetailStoreApi = ReturnType<typeof createImageDetailStore>;
export const ImageDetailStoreContext =
    createContext<ImageDetailStoreApi | undefined>(undefined)
export interface ImageDetailStoreProviderProps {
    children: ReactNode, value: InitImageDetail
}

export const ImageDetailStoreProvider = (
    { children, value }: ImageDetailStoreProviderProps
) => {
    const storeRef = useRef<ImageDetailStoreApi>()
    if (!storeRef.current) {
        storeRef.current = createImageDetailStore(value)
    }

    return (
        <ImageDetailStoreContext.Provider value={storeRef.current}>
            {children}
        </ImageDetailStoreContext.Provider>
    )
}

export const useImageDetailStore = <T,>(
    selector: (store: ImageDetailStore) => T,
): T => {
    const imageDetailStoreContext = useContext(ImageDetailStoreContext)

    if (!imageDetailStoreContext) {
        throw new Error(`useImageDetailStore must be used within ImageDetailStoreProvider`)
    }

    return useStore(imageDetailStoreContext, selector)
}
