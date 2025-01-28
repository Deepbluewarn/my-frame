'use server'

import { 
    addImageComment,
    addImageStar,
    addImageTags,
    deleteImages,
    getFollowerListWithImages,
    getImageById, 
    getImageComments, 
    getImageStarList, 
    getNextImagesById, 
    getPrevImagesById, 
    getPublicImages, 
    getSurroundingImagesById,
    getUserImages,
    getUserImagesByDate,
    hasUserLikedImage,
    removeImageComment,
    removeImageStar,
    removeImageTag,
    searchImages,
    updateImageDescription,
    updateImagesMetadata,
    updateImageTitle,
} from "@/services/Image";
import { actionGetUserIdBySub } from "../user";
import { IComment, Visibility } from "@/db/models/Image";
import { getSession } from "@auth0/nextjs-auth0";

export interface ImagePaginationParams {
    limit?: number;
    last_image_id?: string;
    last_image_date?: number;
}

export interface UserImagePaginationParams extends ImagePaginationParams {
    user_id: string;
}

export async function actionGetImageById(_id: string) {
    const viewerId = await actionGetUserIdBySub();
    return await getImageById(_id, viewerId);
}

export async function actionGetUserImages(params: UserImagePaginationParams) {
    const viewerId = await actionGetUserIdBySub();
    return await getUserImages(params.limit, params.user_id, viewerId, params.last_image_id);
}

export async function actionGetUserImagesByDate(params: UserImagePaginationParams) {
    const viewerId = await actionGetUserIdBySub();
    return await getUserImagesByDate(params.limit, params.user_id, viewerId, params.last_image_date);
}

export async function actionGetPublicImages(params: ImagePaginationParams) {
    return await getPublicImages(params.limit, params.last_image_id)
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

export async function actionUpdateImagesMetadata(
    imageIds: string[], title?: string, description?: string, tags?: string[],
    visibility?: Visibility,
) {
    return (await updateImagesMetadata(
        imageIds, title, description, tags, visibility
    )).acknowledged;
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

export async function actionHasUserLikedImage(imageId: string) {
    const viewerId = await actionGetUserIdBySub();

    if (!viewerId) {
        return;
    }
    return await hasUserLikedImage(imageId, viewerId);
}
export async function actionGetImageStarList(imageId: string) {
    return await getImageStarList(imageId);
}

export async function actionAddImageStar(imageId: string) {
    const viewerId = await actionGetUserIdBySub();
    if (!viewerId) {
        return;
    }
    return await addImageStar(imageId, viewerId)
}

export async function actionRemoveImageStar(imageId: string) {
    const viewerId = await actionGetUserIdBySub();
    if (!viewerId) {
        return;
    }
    return await removeImageStar(imageId, viewerId)
}

export async function actionUpdateImageTitle(imageId: string, new_title: string) {
    return await updateImageTitle(imageId, new_title);
}

export async function actionUpdateImageDescription(imageId: string, new_description: string) {
    return await updateImageDescription(imageId, new_description);
}

export async function actionGetFollowerListWithImages(page: number = 1) {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
        return [];
    }

    return await getFollowerListWithImages(user.sub, page);
}

export async function actionSearchImages(query: string, page: number = 1, pageSize: number = 10) {
    const viewerId = await actionGetUserIdBySub();
    return await searchImages(query, viewerId, page, pageSize);
}

export async function actionDeleteImages(imageIds: string[]) {
    return await deleteImages(imageIds);
}
