'use server'

import { Types } from 'mongoose';
import { getImageById, getNextImagesById } from "@/services/Image";

export async function actionGetImageById(_id: string) {
    return await getImageById(new Types.ObjectId(_id));
}

export async function actionGetNextImagesById(_current_id: string) {
    return await getNextImagesById({ _id: new Types.ObjectId(_current_id) });
}
