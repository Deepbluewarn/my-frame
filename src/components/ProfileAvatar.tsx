'use server'

import dbConnect from "@/db/init";
import Image, { ImageInterface } from "@/db/models/Image";
import { HydratedDocument } from "mongoose";
import { ownerLookupPipeline } from "./User";

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


export async function createImage(image: ImageInterface) {
    await dbConnect();
    const img: HydratedDocument<ImageInterface> = new Image(image);
    return img.save();
}

async function getImage($match: { [key: string]: string }) {
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

async function getImage($match: { [key: string]: string }) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        { $match },
        ...userLookupPipeline,
        ...convertIdPipeline,
    ]);
}

export async function getImageById(_id: string) {
    await dbConnect();

    return (await getImage({ _id: _id }))[0];
}

export async function getNextImagesById({ _id, limit = 1 }: {_id: string, limit?: number}) {
    await dbConnect();

    return await Image.aggregate<ImageInterface>([
        {
            $match: { _id: { $gt: _id }}
        }, {
            $limit: limit
        },
        ...userLookupPipeline,
        ...convertIdPipeline,
    ])
}

export async function getPrevImagesById({ _id, limit = 1 }: {_id: string, limit?: number}) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        {
            $match: { _id: { $lt: _id }}
        }, 
        {
            $sort: { _id: -1 }
        },
        {
            $limit: limit
        },
        ...userLookupPipeline,
        ...convertIdPipeline,
    ])
}

export async function getSurroundingImagesById(_id: string, radius: number) {
    await dbConnect();

    return await Image.aggregate<ImageInterface>([
        {
            $match: { _id: { $gte: _id }}
        },
        {
            $sort: { _id: 1 }
        },
        {
            $limit: radius + 1
        },
        {
            $unionWith: {
                coll: 'images',
                pipeline: [
                    {
                        $match: { _id: { $lt: _id }}
                    },
                    {
                        $sort: { _id: -1 }
                    },
                    {
                        $limit: radius
                    }
                ]
            }
        },
        {
            $sort: { _id: 1 }
        },
        ...userLookupPipeline,
        ...convertIdPipeline,
    ]);
}

export async function getAllImagesByOwner(owner: string) {
    await dbConnect();
    return await Image.find({ owner: owner }).lean();
}

export async function getRecentImagesByOwner(owner: string, limit: number) {
    await dbConnect();
    return (await Image.find({ owner: owner }).sort({ createdAt: -1 }).limit(limit).lean());
}

export async function getRecentPublicImages(limit: number, lastItemId?: string) {
    await dbConnect();
    return (await Image.find({ visibility: 'public' }).sort({ createdAt: -1 }).limit(limit));
}
