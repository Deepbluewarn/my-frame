'use server'

import { 
    addImageTags,
    getImageById, 
    getNextImagesById, 
    getPrevImagesById, 
    getSurroundingImagesById,
    getUserRecentImages,
    removeImageTag, 
} from "@/services/Image";
import { actionGetUserIdBySub } from "../user";

export async function actionGetImageById(_id: string) {
    const viewerId = await actionGetUserIdBySub();
    return await getImageById(_id, viewerId);
}

export async function actionGetUserRecentImages(limit: number, user_id: string) {
    const viewerId = await actionGetUserIdBySub();
    return await getUserRecentImages(limit, user_id, viewerId);
}

export async function actionGetNextImagesById(_current_id: string, limit?: number) {
    const viewerId = await actionGetUserIdBySub();
    const owner = await actionGetImageById(_current_id);
    return await getNextImagesById({ _id: _current_id, viewerId, ownerId: owner.owner, limit });
}

export async function actionGetPrevImagesById(_current_id: string, limit?: number) {
    const viewerId = await actionGetUserIdBySub();
    const owner = await actionGetImageById(_current_id);
    return await getPrevImagesById({ _id: _current_id, viewerId, ownerId: owner.owner, limit });
}

// _id에 해당하는 이미지 문서를 기준으로 좌우 radius 만큼의 문서를 가져온다.
export async function actionGetSurroundingImagesById(_id: string, radius: number) {
    const viewerId = await actionGetUserIdBySub();
    const owner = await actionGetImageById(_id);
    return await getSurroundingImagesById(_id, radius, owner.ownerDetails._id, viewerId);
}

export async function actionAddImageTags(_id: string, tags: string[]) {
    const viewerId = await actionGetUserIdBySub();
    const owner = await actionGetImageById(_id);

    if (viewerId !== owner.ownerDetails._id) {
        console.log('태그 업데이트 실패. 이미지의 소유자만 태그를 업데이트 할 수 있습니다.')
    }

    return await addImageTags(_id, tags);
}

export async function actionRemoveImageTag(_id: string, tag: string) {
    const viewerId = await actionGetUserIdBySub();
    const owner = await actionGetImageById(_id);

    if (viewerId !== owner.ownerDetails._id) {
        console.log('태그 업데이트 실패. 이미지의 소유자만 태그를 업데이트 할 수 있습니다.')
    }

    return await removeImageTag(_id, tag);
}