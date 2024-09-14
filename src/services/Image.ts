'use server'

import dbConnect from "@/db/init";
import Image, { SerializedImageInterface, ImageInterface } from "@/db/models/Image";
import { UserInterface } from "@/db/models/User";
import { HydratedDocument, Types } from "mongoose";
import { userLookupPipeline } from "./User";

const convertIdPipeline = [
    {
        $addFields: {
            id: { $toString: '$_id' },
            owner: {$toString: '$owner'},
        }
    },
    {
        $project: {
            _id: 0,
        }
    },
]

export interface ImageWithOwner extends SerializedImageInterface {
    ownerDetails: UserInterface;
}

export async function createImage(image: ImageInterface) {
    await dbConnect();
    const img: HydratedDocument<ImageInterface> = new Image(image);
    return img.save();
}

async function getImage($match: { [key: string]: Types.ObjectId }) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        { $match },
        ...userLookupPipeline,
        ...convertIdPipeline,
    ]);
}

export async function getImageById(_id: Types.ObjectId) {
    await dbConnect();

    return (await getImage({ _id: new Types.ObjectId(_id) }))[0];
}

export async function getNextImagesById({ _id, limit = 1 }: {_id: Types.ObjectId, limit?: number}) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        {
            $match: { _id: { $gt: new Types.ObjectId(_id) }}
        }, {
            $limit: limit
        },
        ...userLookupPipeline,
        ...convertIdPipeline,
    ])
}

export async function getAllImagesByOwner(owner: Types.ObjectId) {
    await dbConnect();
    return await Image.find({ owner: new Types.ObjectId(owner) });
}

export async function getRecentImagesByOwner(owner: Types.ObjectId, limit: number) {
    await dbConnect();
    return (await Image.find({ owner: new Types.ObjectId(owner) }).sort({ createdAt: -1 }).limit(limit));
}

export async function getRecentPublicImages(limit: number) {
    await dbConnect();
    return (await Image.find({ visibility: 'public' }).sort({ createdAt: -1 }).limit(limit));
}
