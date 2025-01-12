'use client'

import { UserIdState, UserIdStore, createUserIdStore } from "@/stores/userid-store"
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type UserIdStoreApi = ReturnType<typeof createUserIdStore>;
export const UserIdStoreContext =
    createContext<UserIdStoreApi | undefined>(undefined)
export interface UserIdStoreProviderProps {
    children: ReactNode, value: UserIdState
}
export const UserIdStoreProvider = (
    { children, value } : UserIdStoreProviderProps
) => {
    const storeRef = useRef<UserIdStoreApi>()
    if (!storeRef.current) {
        storeRef.current = createUserIdStore(value._id)
    }

    return (
        <UserIdStoreContext.Provider value={storeRef.current}>
            {children}
        </UserIdStoreContext.Provider>
    )
}

export const useUserIdStore = <T,>(
    selector: (store: UserIdStore) => T,
): T => {
    const userIdStoreContext = useContext(UserIdStoreContext)

    if (!userIdStoreContext) {
        throw new Error(`useUserIdStore must be used within UserIdStoreProvider`)
    }

    return useStore(userIdStoreContext, selector)
}
