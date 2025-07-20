'use server'

import { 
    addImageComment,
    addImageStar,
    addImageTags,
    deleteImages,
    deleteS3Images,
    getFollowerListWithImages,
    getImageById, 
    getImageComments, 
    getImageStarList, 
    getNextImagesById, 
    getPrevImagesById, 
    getRecentPublicImages, 
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
import Image, { IComment, Visibility } from "@/db/models/Image";
import { getSession } from "@auth0/nextjs-auth0";
import { S3 } from "@aws-sdk/client-s3";
import { requireAuth, requireOwner, allowAnonymousView } from "@/utils/auth-wrapper";

export interface ImagePaginationParams {
    limit?: number;
    last_image_id?: string;
    last_image_date?: number;
}

export interface UserImagePaginationParams extends ImagePaginationParams {
    user_id: string;
}

export async function actionGetImageById(_id: string) {
    // 비로그인 사용자도 이미지 조회 가능
    const getImageAction = await allowAnonymousView(
        async (userId, imageId) => {
            return await getImageById(imageId, userId);
        }
    );
    
    return getImageAction(_id);
}

export async function actionGetUserImages(params: UserImagePaginationParams) {
    // 비로그인 사용자도 사용자 이미지 조회 가능
    const getUserImagesAction = await allowAnonymousView(
        async (userId, params) => {
            return await getUserImages(
                params.user_id, 
                params.limit, 
                userId, 
                params.last_image_id
            );
        }
    );
    
    return getUserImagesAction(params);
}

export async function actionGetUserImagesByDate(params: UserImagePaginationParams) {
    const viewerId = await actionGetUserIdBySub();
    return await getUserImagesByDate(params.limit, params.user_id, viewerId, params.last_image_date);
}

export async function actionGetRecentPublicImages(params: ImagePaginationParams) {
    const viewerId = await actionGetUserIdBySub();
    return await getRecentPublicImages(params.limit, params.last_image_id, viewerId);
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
    const res = await getSurroundingImagesById(_id, radius, owner?.ownerDetails._id, viewerId);

    return res;
}

export async function actionAddImageTags(_id: string, tags: string[]) {
    // 이미지 소유자만 태그 업데이트 가능
    // 먼저 소유자 확인 함수를 정의
    const isImageOwner = async (userId: string, imageId: string) => {
        const image = await getImageById(imageId);
        return userId === image.ownerDetails._id.toString();
    };

    const addTagsAction = await requireOwner(
        async (userId, imageId, imageTags) => {
            return await addImageTags(imageId, imageTags);
        },
        isImageOwner,
        '태그를 업데이트하려면 로그인이 필요합니다.',
        '태그 업데이트 실패. 이미지의 소유자만 태그를 업데이트 할 수 있습니다.'
    );

    return addTagsAction(_id, tags);
}

export async function actionRemoveImageTag(_id: string, tag: string) {
    // 이미지 소유자만 태그 제거 가능
    // 소유자 확인 함수 재사용
    const isImageOwner = async (userId: string, imageId: string) => {
        const image = await getImageById(imageId);
        return userId === image.ownerDetails._id.toString();
    };

    const removeTagAction = await requireOwner(
        async (userId, imageId, tagToRemove) => {
            return await removeImageTag(imageId, tagToRemove);
        },
        isImageOwner,
        '태그를 제거하려면 로그인이 필요합니다.',
        '태그 업데이트 실패. 이미지의 소유자만 태그를 업데이트 할 수 있습니다.'
    );

    return removeTagAction(_id, tag);
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
    // 로그인 권한 확인 로직을 래퍼 함수로 대체
    const addCommentAction = await requireAuth(
        async (userId: string, imageId: string, commentText: string) => {
            const res = await addImageComment(imageId, userId, commentText);

            if(!res) {
                throw new Error('댓글 추가 실패: 서버 오류가 발생했습니다.');
            }

            return {
                _id: res._id,
                commenter: res.commenter,
                text: res.text,
                createdAt: res.createdAt,
            } as IComment
        }, 
        '댓글을 작성하려면 로그인이 필요합니다.'
    );

    return addCommentAction(_id, comment);
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
    // 비로그인 사용자도 좋아요 목록 조회 가능
    return await getImageStarList(imageId);
}

export async function actionAddImageStar(imageId: string) {
    // 로그인한 사용자만 좋아요 추가 가능
    const addStarAction = await requireAuth(
        async (userId, imageId) => {
            return await addImageStar(imageId, userId);
        },
        '좋아요를 추가하려면 로그인이 필요합니다.'
    );
    
    return addStarAction(imageId);
}

export async function actionRemoveImageStar(imageId: string) {
    // 로그인한 사용자만 좋아요 제거 가능
    const removeStarAction = await requireAuth(
        async (userId, imageId) => {
            return await removeImageStar(imageId, userId);
        },
        '좋아요를 취소하려면 로그인이 필요합니다.'
    );
    
    return removeStarAction(imageId);
}

export async function actionUpdateImageTitle(imageId: string, new_title: string) {
    // 이미지 소유자만 제목 업데이트 가능
    const isImageOwner = async (userId: string, imageId: string) => {
        const image = await getImageById(imageId);
        return userId === image.ownerDetails._id.toString();
    };

    const updateTitleAction = await requireOwner(
        async (userId, imageId, title) => {
            return await updateImageTitle(imageId, title);
        },
        isImageOwner,
        '이미지 제목을 수정하려면 로그인이 필요합니다.',
        '이미지 제목 업데이트 실패. 이미지의 소유자만 가능합니다.'
    );

    return updateTitleAction(imageId, new_title);
}

export async function actionUpdateImageDescription(imageId: string, new_description: string) {
    // 이미지 소유자만 설명 업데이트 가능
    const isImageOwner = async (userId: string, imageId: string) => {
        const image = await getImageById(imageId);
        return userId === image.ownerDetails._id.toString();
    };

    const updateDescAction = await requireOwner(
        async (userId, imageId, description) => {
            return await updateImageDescription(imageId, description);
        },
        isImageOwner,
        '이미지 설명을 수정하려면 로그인이 필요합니다.',
        '이미지 설명 업데이트 실패. 이미지의 소유자만 가능합니다.'
    );

    return updateDescAction(imageId, new_description);
}

export async function actionGetFollowerListWithImages(page: number = 1, pageSize: number = 10) {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
        return [];
    }

    return await getFollowerListWithImages(user.sub, page, pageSize);
}

export async function actionSearchImages(query: string, page: number = 1, pageSize: number = 10) {
    const viewerId = await actionGetUserIdBySub();
    return await searchImages(query, viewerId, page, pageSize);
}

export async function actionDeleteImages(imageIds: string[]) {
    return await deleteImages(imageIds);
}

export async function actionDeleteAllUserImages(userId: string) {
    const session = await getSession();
    const user = session?.user;
    const result = {
        images_deleted: false,
        s3_deleted: false,
    }

    if (!user) {
        return result;
    }

    const images = await getUserImages(userId);
    const imageIds = images.map(img => img._id);
    const s3Keys = images.map(img => img.s3_key);

    result.images_deleted = await deleteImages(imageIds);
    result.s3_deleted = await deleteS3Images(s3Keys);

    return result;
}
