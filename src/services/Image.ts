'use server'

import dbConnect from "@/db/init";
import Image, { IComment, ImageInterface, Visibility } from "@/db/models/Image";
import { HydratedDocument, PipelineStage } from "mongoose";
import { getUserById, getUserBySub, ownerLookupPipeline } from "./User";
import User, { IUserInfo, UserInterface } from "@/db/models/User";
import { getVisibilityPipeline } from "@/utils/service";
import { SearchResult } from "./types";

export interface ImageWithOwner extends ImageInterface {
    ownerDetails: UserInterface;
}

export interface IFollowerListWithImage extends ImageWithOwner{
    followerImages: ImageInterface[];
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

export async function getPublicImages(limit: number = 10, _id?: string) {
    await dbConnect();
    const pipelines: PipelineStage[] = [
        ...ownerLookupPipeline,
    ];

    if (_id) {
        pipelines.push({
            $match: {
                _id: { $gt: _id },
            },
        })
    }

    if (limit) {
        pipelines.push({
            $limit: limit,
        })
    }
    
    return await Image.aggregate<ImageWithOwner>(pipelines)
}

export async function getNextImagesById({ _id, viewerId, ownerId, limit = 1 }: { _id: string, viewerId?: string, ownerId: string, limit?: number }) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        ...ownerLookupPipeline,
        ...getVisibilityPipeline(viewerId),
        {
            $match: {
                owner: ownerId,
                _id: { $gt: _id },
            },
        }, {
            $limit: limit
        },

    ])
}

export async function getPrevImagesById({ _id, viewerId, ownerId, limit = 1 }: { _id: string, viewerId?: string, ownerId: string, limit?: number }) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        ...ownerLookupPipeline,
        ...getVisibilityPipeline(viewerId),
        {
            $match: {
                owner: ownerId,
                _id: { $lt: _id },
            },
        },
        {
            $sort: { _id: -1 }
        },
        {
            $limit: limit
        },
    ])
}

export async function getSurroundingImagesById(imageId: string, radius: number, ownerId: string, viewerId?: string) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        ...ownerLookupPipeline,
        ...getVisibilityPipeline(viewerId),
        {
            $match: {
                owner: ownerId,
                _id: { $gte: imageId },
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
                    ...ownerLookupPipeline,
                    ...getVisibilityPipeline(viewerId),
                    {
                        $match: { _id: { $lt: imageId }, owner: ownerId }
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
    ]);
}

/**
 * 
 * @param limit 이미지 개수 제한
 * @param userId 이미지의 owner
 * @param lastItemId pagination을 위한 마지막 이미지 문서의 _id
 * @returns ImageWithOwner[]
 */
export async function getUserImages(limit: number = 10, userId: string, viewerId?: string, lastItemId?: string) {
    await dbConnect();

    return await Image.aggregate<ImageWithOwner>([
        ...ownerLookupPipeline,
        ...getVisibilityPipeline(viewerId),
        {
            $match: {
                ...(lastItemId && { _id: { $gt: lastItemId } }),
                owner: userId,
            }
        },
        {
            $limit: limit
        }
    ])
}

export async function getUserImagesByDate(limit: number = 10, userId: string, viewerId?: string, lastImageDate?: number): Promise<[number, ImageWithOwner[]][]> {
    await dbConnect();

    const matchStage: PipelineStage.Match = {
        $match: {
            owner: userId,
            ...(lastImageDate && { uploadedAt: { $lt: new Date(lastImageDate) } })
        }
    };

    const groupStage: PipelineStage.Group = {
        $group: {
            _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$uploadedAt" }
            },
            images: { $push: "$$ROOT" }
        }
    };

    const sortStage: PipelineStage.Sort = {
        $sort: { "_id": -1 }
    };

    const limitStage: PipelineStage.Limit = {
        $limit: limit
    };

    const pipeline = [
        ...ownerLookupPipeline,
        ...getVisibilityPipeline(viewerId),
        matchStage, groupStage, sortStage, limitStage
    ];

    const result = await Image.aggregate<{_id: string, images: ImageWithOwner[]}>(pipeline);

    return result.map(group => [new Date(group._id).getTime(), group.images]);
}

export async function addImageTags(imageId: string, tags: string[]) {
    await dbConnect();

    return await Image.updateOne(
        { _id: imageId },
        { $addToSet: { tags: { $each: tags } } }
    )
}

export async function removeImageTag(imageId: string, tag: string) {
    await dbConnect();

    return await Image.updateOne(
        { _id: imageId },
        { $pull: { tags: tag } }
    )
}

export async function updateImagesMetadata(
    imageIds: string[], title?: string, description?: string, tags?: string[],
    visibility?: Visibility,
) {
    await dbConnect();

    const updateFields: any = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (visibility) updateFields.visibility = visibility;

    const updateQuery: any = { $set: updateFields };
    
    if (tags && Array.isArray(tags)) {
        updateQuery.$addToSet = { tags: { $each: tags } };
    }

    return await Image.updateMany(
        { _id: { $in: imageIds } },
        updateQuery
    );
}

export async function addImageComment(imageId: string, commenterId: string, comment: string) {
    await dbConnect();

    const commenter = await getUserById(commenterId);
    const newImage = await Image.findOneAndUpdate(
        { _id: imageId },
        {
            $push: {
                comments: {
                    commenter: commenterId,
                    text: comment,
                }
            }
        },
        { new: true }
    )

    if (!newImage || !commenter) {
        return;
    }

    const newComments = newImage.comments;

    return {
        _id: newComments[newComments.length - 1]._id,
        commenter: {
            username: commenter.username,
            profilePicture: commenter.profilePicture,
            sub: commenter.sub,
        } as IUserInfo,
        text: newComments[newComments.length - 1].text,
        createdAt: newComments[newComments.length - 1].createdAt,
    } as IComment;
}

export async function getImageComments(imageId: string) {
    const image = await Image.aggregate([
        {
            $match: { _id: imageId }
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'comments.commenter',
                'foreignField': '_id',
                'as': 'commenter',
                'pipeline': [
                    {
                        '$project': {
                            'profilePicture': 1,
                            'username': 1,
                            'sub': 1,
                        }
                    }
                ]
            }
        }, {
            '$unwind': {
                'path': '$comments'
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'comments.commenter',
                'foreignField': '_id',
                'as': 'comments.commenter',
                'pipeline': [
                    {
                        '$project': {
                            'profilePicture': 1,
                            'username': 1,
                            'sub': 1,
                        }
                    }
                ]
            }
        }, {
            '$unwind': {
                'path': '$comments.commenter'
            }
        }, {
            '$group': {
                '_id': '$_id',
                'comments': {
                    '$push': '$comments'
                }
            }
        }
    ])

    if (!image || image.length <= 0) {
        return null;
    }

    return (image[0].comments as IComment[]).map(c => {
        const res: IComment = {
            _id: c._id,
            commenter: c.commenter,
            text: c.text,
            createdAt: c.createdAt,
        }
        return res;
    })
}

export async function removeImageComment(imageId: string, commentId: string) {
    return await Image.updateOne(
        { _id: imageId },
        { $pull: { comments: { _id: commentId } } }
    );
}

export async function hasUserLikedImage(imageId: string, viewerId: string) {
    await dbConnect();
    const like = await Image.findOne({ _id: imageId, owner: viewerId })
    return !!like;
}

export async function getImageStarList(imageId: string): Promise<IUserInfo[]> {
    const res = await Image.aggregate([
        { $match: { _id: imageId } },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'likes',
                'foreignField': '_id',
                'as': 'likeUserList',
                'pipeline': [
                    {
                        '$project': {
                            'profilePicture': 1,
                            'username': 1,
                            'sub': 1,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                likeUserList: 1
            }
        }
    ])

    console.log('Image Service getImageStarList likeUserList: ', JSON.stringify(res[0].likeUserList))

    return res[0].likeUserList;
}

// 좋아요를 추가 또는 취소한 유저의 IUserInfo 객체를 반환.
// 실패시 null 반환.
export async function addImageStar(imageId: string, viewerId: string): Promise<{userInfo: IUserInfo, star: boolean} | null> {
    const user = await getUserById(viewerId);

    if (!user) {
        throw new Error('좋아요 추가에 실패했습니다. 회원 정보를 찾을 수 없습니다.')
    }

    const res = await Image.updateOne(
        { _id: imageId },
        { $addToSet: { likes: viewerId } }
    )

    if (res.acknowledged) {
        return {
            userInfo: {
                profilePicture: user.profilePicture!,
                username: user.username!,
                sub: user.sub!
            },
            star: true
        }
    } else {
        return null;
    }
}

export async function removeImageStar(imageId: string, viewerId: string): Promise<{userInfo: IUserInfo, star: boolean} | null> {
    const user = await getUserById(viewerId);

    if (!user) {
        throw new Error('좋아요 취소에 실패했습니다. 회원 정보를 찾을 수 없습니다.')
    }

    const res = await Image.updateOne(
        { _id: imageId },
        { $pull: { likes: user._id } }
    )

    if (res.acknowledged) {
        return {
            userInfo: {
                profilePicture: user.profilePicture!,
                username: user.username!,
                sub: user.sub!
            },
            star: false
        }
    } else {
        return null;
    }
}

export async function updateImageTitleAndDescription(imageId: string, new_title: string, new_description: string) {
    const imageInfo = {
        title: new_title,
        description: new_description
    }

    const res = await Image.updateOne(
        { _id: imageId },
        {
            $set: imageInfo
        }
    )

    if (res.acknowledged && res.modifiedCount > 0) {
        return imageInfo
    } else {
        return null;
    }
}

/**
 * 
 * @param userSub 팔로워 유저의 sub
 * @param lastUserId pagination 구현, 팔로워 배열의 마지막 유저의 _id로 다음 페이지를 가져옴
 * @returns 
 */
export async function getFollowerListWithImages(userSub: string, page: number = 1) {
    const pageSize = 1;
    // users 문서에서 팔로우 목록을 가져온다. (users의 _id로 구성된 배열)
    // 이 배열의 각 요소를 기준으로 이미지 목록을 가져온다.

    return await User.aggregate<IFollowerListWithImage>([
        {
            '$match': {
                'sub': userSub
            }
        }, {
            '$unwind': {
                'path': '$following'
            }
        }, 
        {
            '$lookup': {
                'from': 'images',
                'localField': 'following',
                'foreignField': 'owner',
                'pipeline': [
                    {
                        '$limit': 4
                    }
                ],
                'as': 'followerImages'
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'following',
                'foreignField': '_id',
                'as': 'ownerDetails'
            }
        }, 
        {
            '$unwind': {
                'path': '$ownerDetails'
            }
        },
        {
            '$project': {
                '_id': 0,
                'ownerDetails': 1,
                'followerImages': 1
            }
        },
        {
            '$skip': (page - 1) * pageSize
        },
        {
            '$limit': pageSize
        }
    ])
}

export async function searchImages(query: string, viewerId?: string, page: number = 1, pageSize: number = 10): Promise<SearchResult<ImageWithOwner>> {
    await dbConnect();

    const words = decodeURI(query).split(' ').map(word => new RegExp(word, 'i')); // 'i' for case-insensitive

    const images = await Image.aggregate([
        ...ownerLookupPipeline,
        ...getVisibilityPipeline(viewerId),
        {
            $match: {
                $or: [
                    { title: { $in: words } },
                    { tags: { $in: words } },
                    { description: { $in: words } }
                ]
            }
        },
        {
            $facet: {
                results: [
                    { $skip: (page - 1) * pageSize },
                    { $limit: pageSize }
                ],
                totalCount: [
                    { $count: 'count' }
                ]
            }
        }
    ]);

    const totalCount = images[0].totalCount[0] ? images[0].totalCount[0].count : 0;

    return {
        results: images[0].results,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
    };
}

export async function deleteImages(imageIds: string[]) {
    await dbConnect();

    return (await Image.deleteMany({
        _id: { $in: imageIds }
    })).acknowledged;
}