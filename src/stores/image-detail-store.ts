import {
    actionAddImageComment,
    actionAddImageStar,
    actionAddImageTags,
    actionGetImageComments,
    actionGetImageStarList,
    actionGetNextImagesById,
    actionGetPrevImagesById,
    actionRemoveImageComment,
    actionRemoveImageStar,
    actionRemoveImageTag,
    actionUpdateImageDescription,
    actionUpdateImageTitle
} from "@/actions/image";
import { IComment } from "@/db/models/Image";
import { IUserInfo } from "@/db/models/User";
import { InitImageDetail } from "@/providers/image-detail-store-provider";
import { ImageWithOwner } from "@/services/Image";
import { createStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const THUMBNAIL_LIST_RADIUS = parseInt(process.env.NEXT_PUBLIC_THUMBNAIL_LIST_RADIUS || '3', 10);
export interface ImageWithOwnerPagination extends ImageWithOwner {
    prev?: string | null;
    next?: string | null;
}

export type ImageDetailState = {
    images: ImageWithOwner[]
    thumbnails: (ImageWithOwner | null)[]
    currentImageId: string
    currentImage: ImageWithOwner | null
    comments: IComment[] | null
    starList: IUserInfo[]
}

export type ImageDetailActions = {
    actions: {
        common: {
            init: () => Promise<void>,
            setId: (currentImageId: string) => void,
        }
        navigate: (direction: 'prev' | 'next') => Promise<void>,
        comment: {
            add: (comment: string) => Promise<void>,
            remove: (comment_id: string) => Promise<void>,
            update: (comment_id: string, new_value: string) => Promise<void>,
        }
        tags: {
            add: (new_value: string) => Promise<void>,
            remove: (target_value: string) => Promise<void>,
        }
        star: {
            add: () => Promise<void>,
            remove: () => Promise<void>,
        }
        title: {
            update: (new_value: string) => Promise<void>,
        }
        description: {
            update: (new_value: string) => Promise<void>,
        }
    }
}

export type ImageDetailStore = ImageDetailState & ImageDetailActions;

function updateHistory(_id: string) {
    const url = `/image/${_id}`
    window.history.pushState(null, '', url)
}

async function getImageInfo(imageId: string) {
    const comments = await actionGetImageComments(imageId);
    const starList = await actionGetImageStarList(imageId);

    return { comments, starList }
}
function findImage(images: ImageWithOwner[], imageId: string) {
    return images.find(img => img._id === imageId) || null
}
function getThumbnailList(
    images: ImageWithOwner[],
    currentImageId: string
) {
    const ids = images.map(img => img._id);
    let currIdx = ids.indexOf(currentImageId);
    const res: (ImageWithOwner | null)[] = [];

    if (currIdx === -1) {
        return [];
    }

    const startIdx = currIdx - THUMBNAIL_LIST_RADIUS;
    const endIdx = currIdx + THUMBNAIL_LIST_RADIUS;

    for (let i = startIdx; i <= endIdx; i++) {
        res.push(images[i]);
    }
    return res;
}

export function createImageDetailStore(initData: InitImageDetail) {
    const store = createStore(subscribeWithSelector(immer<ImageDetailStore>((set, get) => {
        return {
            images: initData.images,
            thumbnails: getThumbnailList(
                initData.images, initData.imageId,
            ),
            currentImage: findImage(initData.images, initData.imageId),
            currentImageId: initData.imageId,
            comments: [],
            starList: [],
            actions: {
                common: {
                    init: async () => {
                        const { currentImageId } = get()
                        const { comments, starList } = await getImageInfo(currentImageId)

                        set({ comments, starList })
                    },
                    setId: (currentImageId) => set({ currentImageId })
                },
                navigate: async (direction) => {
                    const { images, currentImageId } = get();
                    const ids = images.map(img => img._id);
                    const currIdx = ids.indexOf(currentImageId);

                    if (currIdx === -1) {
                        return;
                    }

                    switch (direction) {
                        case "prev":
                            if (currIdx <= 0) {
                                return;
                            }
                            updateHistory(ids[currIdx - 1])
                            set({ currentImageId: ids[currIdx - 1] })

                            if (currIdx <= 3) {
                                const firstImageId = ids[0];
                                const prevImages = await actionGetPrevImagesById(firstImageId, 4);
                                set({ images: [...prevImages, ...images] })
                            }
                            break;
                        case "next":
                            if (ids.length <= currIdx + 1) {
                                return;
                            }
                            updateHistory(ids[currIdx + 1])
                            set({ currentImageId: ids[currIdx + 1] })

                            if (ids.length - (currIdx + 2) <= 3) {
                                const lastImageId = ids[ids.length - 1];
                                const nextImages = await actionGetNextImagesById(lastImageId, 4);
                                set({ images: [...images, ...nextImages] });
                            }
                            break;
                    }
                },
                comment: {
                    add: async (comment) => {
                        try {
                            const { currentImageId, comments } = get();
                            const addedComment = await actionAddImageComment(currentImageId, comment)

                            set({ comments: [...(comments || []), addedComment] })
                        } catch (e) {
                            alert((e as Error).message)
                        }
                    },
                    remove: async (comment_id) => {
                        try {
                            const { currentImageId, comments } = get();
                            const removed = await actionRemoveImageComment(currentImageId, comment_id)

                            if (removed) {
                                set({ comments: comments?.filter(c => c._id !== comment_id) })
                            }
                        } catch (e) {
                            alert((e as Error).message)
                        }
                    },
                    update: async (comment_id) => {
                        // 구현 예정
                    },
                },
                tags: {
                    add: async (new_value) => {
                        try {
                            const { currentImageId } = get()
                            const update = await actionAddImageTags(currentImageId, [new_value])

                            if (!update) {
                                alert('태그를 추가할 수 없습니다.')
                                return;
                            }

                            set((state) => ({
                                images: state.images.map((img) =>
                                    img._id === currentImageId ? { ...img, tags: [...img.tags, new_value] } : img
                                ),
                            }));
                        } catch (e) {
                            alert('태그를 추가할 수 없습니다.')
                        }

                    },
                    remove: async (target_value) => {
                        try {
                            const { currentImageId } = get()
                            const update = await actionRemoveImageTag(currentImageId, target_value);

                            if (!update) {
                                alert('태그를 삭제할 수 없습니다.')
                                return;
                            }
                            set((state) => ({
                                images: state.images.map((img) => {
                                    const new_tags = [...img.tags];
                                    new_tags.splice(new_tags.indexOf(target_value), 1);

                                    return img._id === currentImageId ? { ...img, tags: new_tags } : img
                                }),
                            }));
                        } catch (e) {
                            alert('태그를 삭제할 수 없습니다.')
                        }

                    },
                },
                star: {
                    add: async () => {
                        const { currentImageId, starList } = get();
                        try {
                            const res = await actionAddImageStar(currentImageId);
                
                            if (res) {
                                set({ starList: [...starList, res.userInfo]})
                            }
                        } catch (e) {
                            alert('좋아요를 추가할 수 없습니다.');
                        }
                    },
                    remove: async () => {
                        const { currentImageId, starList } = get();
                        try {
                            const res = await actionRemoveImageStar(currentImageId);
                
                            if (res) {
                                set({ starList: starList.filter(l => l.sub !== res.userInfo.sub)})
                            }
                        } catch (e) {
                            alert('좋아요를 취소할 수 없습니다.');
                        }
                    },
                },
                title: {
                    update: async (new_value) => {
                        const { currentImageId } = get()
                        const update = await actionUpdateImageTitle(currentImageId, new_value)

                        if (!update) {
                            alert('사진 제목 업데이트에 실패했습니다.')
                            return;
                        }

                        set((state) => ({
                            images: state.images.map((img) =>
                                img._id === currentImageId ? { ...img, title: update.title } : img
                            ),
                        }));
                    },
                },
                description: {
                    update: async (new_value) => {
                        const { currentImageId } = get()
                        const update = await actionUpdateImageDescription(currentImageId, new_value)

                        if (!update) {
                            alert('사진 설명 업데이트에 실패했습니다.')
                            return;
                        }

                        set((state) => ({
                            images: state.images.map((img) =>
                                img._id === currentImageId ? { ...img, description: update.description } : img
                            ),
                        }));
                    },
                }
            }
        }
    })))

    store.subscribe(state => state.currentImageId, async (id) => {
        const images = store.getState().images;
        const { comments, starList } = await getImageInfo(id);

        store.setState({
            currentImage: images.find(img => img._id === id),
            thumbnails: getThumbnailList(
                images,
                id,
            ),
            comments, starList
        })
    })

    store.subscribe(state => state.images, (images) => {
        const { currentImageId } = store.getState();

        store.setState({
            currentImage: images.find(img => img._id === currentImageId),
            thumbnails: getThumbnailList(
                images,
                currentImageId,
            ),
        })
    })

    return store;
}
