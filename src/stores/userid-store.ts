import { createStore } from "zustand";

export type UserIdState = {
    _id: string
}

export type UserIdActions = {
    setId: (_id: string) => void
}

export type UserIdStore = UserIdState & UserIdActions;

export function createUserIdStore(initState: string) {
    return createStore<UserIdStore>(set => {
        return {
            _id: initState,
            setId: (_id) => set((state) => ({ _id }))
        }
    })
}
