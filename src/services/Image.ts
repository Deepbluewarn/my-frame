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
    await dbConnect();

    return await Image.aggregate<ImageInterface>([
        { $match },
        ...ownerLookupPipeline,
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
        ...ownerLookupPipeline,
        ...convertIdPipeline,
    ])
}

export async function getPrevImagesById({ _id, limit = 1 }: {_id: string, limit?: number}) {
    await dbConnect();

    return await Image.aggregate<ImageInterface>([
        {
            $match: { _id: { $lt: _id }}
        }, 
        {
            $sort: { _id: -1 }
        },
        {
            $limit: limit
        },
        ...ownerLookupPipeline,
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
        ...ownerLookupPipeline,
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

    const query: any = { visibility: 'public' };

    if (lastItemId) {
        query._id = { $gt: lastItemId };
    }

    return await Image.find(query).sort({ createdAt: -1 }).limit(limit).lean();
}
