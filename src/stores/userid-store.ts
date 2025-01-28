import { createStore } from "zustand";

export type UserInfoState = {
    _id: string
    sub: string
}

export type UserInfoActions = {
    setId: (_id: string) => void
    setSub: (sub: string) => void
}

export type UserInfoStore = UserInfoState & UserInfoActions;

export function createUserInfoStore(initState: UserInfoState) {
    return createStore<UserInfoStore>(set => {
        return {
            _id: initState._id,
            sub: initState.sub,
            setId: (_id) => set({ _id }),
            setSub: (sub) => set({ sub })
        }
    })
}
