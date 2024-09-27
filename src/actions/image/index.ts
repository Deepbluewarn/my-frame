'use server'

import { 
    getImageById, 
    getNextImagesById, 
    getPrevImagesById, 
    getRecentPublicImages, 
    getSurroundingImagesById, 
} from "@/services/Image";

export async function actionGetImageById(_id: string) {
    return await getImageById(_id);
}

export async function actionGetRecentPublicImages(limit: number, _id: string) {
    return await getRecentPublicImages(limit, _id);
}

export async function actionGetNextImagesById(_current_id: string, limit?: number) {
    return await getNextImagesById({ _id: _current_id, limit });
}

export async function actionGetPrevImagesById(_current_id: string, limit?: number) {
    return await getPrevImagesById({ _id: _current_id, limit });
}

// _id에 해당하는 이미지 문서를 기준으로 좌우 radius 만큼의 문서를 가져온다.
export async function actionGetSurroundingImagesById(_id: string, radius: number) {
    return await getSurroundingImagesById(_id, radius);
}
