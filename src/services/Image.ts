'use server'

import dbConnect from "@/db/init";
import Image, { ImageInterface } from "@/db/models/Image";
import { HydratedDocument } from "mongoose";
import { ownerLookupPipeline } from "./User";
import { UserInterface } from "@/db/models/User";
import { getVisibilityPipeline } from "@/utils/service";

export interface ImageWithOwner extends ImageInterface {
    ownerDetails: UserInterface;
}

export async function createImage(image: ImageInterface) {
    await dbConnect();
    const img: HydratedDocument<ImageInterface> = new Image(image);
    return img.save();
}

async function getImage($match: { [key: string]: string }, viewerId?: string) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        { $match },
        ...ownerLookupPipeline,
        ...getVisibilityPipeline(viewerId),
    ]);
}

export async function getImageById(_id: string, viewerId?: string) {
    await dbConnect();

    return (await getImage({ _id: _id }, viewerId))[0];
}

export async function getNextImagesById({ _id, viewerId, ownerId, limit = 1 }: {_id: string, viewerId?: string, ownerId:string, limit?: number}) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        {
            $match: { 
                _id: { $gt: _id },
                owner: ownerId
            },
        }, {
            $limit: limit
        },
        ...ownerLookupPipeline,
        ...getVisibilityPipeline(viewerId),
    ])
}

export async function getPrevImagesById({ _id, viewerId, ownerId, limit = 1 }: {_id: string, viewerId?: string, ownerId: string, limit?: number}) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        {
            $match: { 
                _id: { $lt: _id },
                owner: ownerId
            },
        }, 
        {
            $sort: { _id: -1 }
        },
        {
            $limit: limit
        },
        ...ownerLookupPipeline,
        ...getVisibilityPipeline(viewerId),
    ])
}

export async function getSurroundingImagesById(imageId: string, radius: number, ownerId: string, viewerId?: string) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        {
            $match: { 
                _id: { $gte: imageId },
                owner: ownerId
            }
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
                        $match: { _id: { $lt: imageId }, owner: ownerId}
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
        ...getVisibilityPipeline(viewerId),
    ]);
}

/**
 * 
 * @param limit 이미지 개수 제한
 * @param userId 이미지의 owner
 * @param lastItemId pagination을 위한 마지막 이미지 문서의 _id
 * @returns ImageWithOwner[]
 */
export async function getUserRecentImages(limit: number, userId: string, viewerId?: string, lastItemId?: string) {
    await dbConnect();

    return await Image.aggregate([
        {
            $match: {
                _id: { $gt: lastItemId },
                owner: userId,
            }
        },
        ...ownerLookupPipeline,
        ...getVisibilityPipeline(viewerId),
        {
            $limit: limit
        }
    ])
}
