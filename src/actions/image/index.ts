'use server'

import { 
    addImageComment,
    addImageStar,
    addImageTags,
    getImageById, 
    getImageComments, 
    getImageStarList, 
    getNextImagesById, 
    getPrevImagesById, 
    getSurroundingImagesById,
    getUserRecentImages,
    removeImageComment,
    removeImageStar,
    removeImageTag, 
} from "@/services/Image";
import { actionGetUserIdBySub } from "../user";
import { IComment } from "@/db/models/Image";

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
        throw new Error('태그 업데이트 실패. 이미지의 소유자만 태그를 업데이트 할 수 있습니다.')
    }

    return await addImageTags(_id, tags);
}

export async function actionRemoveImageTag(_id: string, tag: string) {
    const viewerId = await actionGetUserIdBySub();
    const owner = await actionGetImageById(_id);

    if (viewerId !== owner.ownerDetails._id) {
        throw new Error('태그 업데이트 실패. 이미지의 소유자만 태그를 업데이트 할 수 있습니다.')
    }

    return await removeImageTag(_id, tag);
}

export async function actionAddImageComment(_id: string, comment: string) {
    const commenterId = await actionGetUserIdBySub();

    console.log('actionAddImageComment commenterId: ', commenterId)

    if (!commenterId) {
        throw new Error('댓글을 단 유저의 정보를 찾을 수 없습니다.')
    }

    const res = await addImageComment(_id, commenterId, comment);

    if(!res) {
        throw new Error('댓글 추가 실패')
    }

    return {
        _id: res._id,
        commenter: res.commenter,
        text: res.text,
        createdAt: res.createdAt,
    } as IComment
}

export async function actionGetImageComments(_id: string) {
    console.log('actionGetImageComments _id: ', _id)
    return await getImageComments(_id);
}

export async function actionRemoveImageComment(imageId: string, commentId: string) {
    const res = await removeImageComment(imageId, commentId)

    return res.acknowledged && res.modifiedCount > 0;
}

export async function actionGetImageStarList(imageId: string) {
    return await getImageStarList(imageId);
}

export async function actionAddImageStar(imageId: string, userSub: string) {
    return await addImageStar(imageId, userSub)
}

export async function actionRemoveImageStar(imageId: string, userSub: string) {
    return await removeImageStar(imageId, userSub)
}