'use client'

import { UserInfoState, UserInfoStore, createUserInfoStore } from "@/stores/userid-store"
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type UserInfoStoreApi = ReturnType<typeof createUserInfoStore>;
export const UserInfoStoreContext =
    createContext<UserInfoStoreApi | undefined>(undefined)
export interface UserInfoStoreProviderProps {
    children: ReactNode, value: UserInfoState
}
export const UserInfoStoreProvider = (
    { children, value } : UserInfoStoreProviderProps
) => {
    const storeRef = useRef<UserInfoStoreApi>()
    if (!storeRef.current) {
        storeRef.current = createUserInfoStore(value)
    }

    return (
        <UserInfoStoreContext.Provider value={storeRef.current}>
            {children}
        </UserInfoStoreContext.Provider>
    )
}

export const useUserInfoStore = <T,>(
    selector: (store: UserInfoStore) => T,
): T => {
    const userInfoStoreContext = useContext(UserInfoStoreContext)

    if (!userInfoStoreContext) {
        throw new Error(`useUserInfoStore must be used within UserInfoStoreProvider`)
    }

    return useStore(userInfoStoreContext, selector)
}
