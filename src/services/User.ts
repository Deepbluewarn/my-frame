import dbConnect from "@/db/init";
import User, { UserInterface } from "@/db/models/User";
import { HydratedDocument } from "mongoose";

// 이미지 문서의 owner 속성 populate
export const ownerLookupPipeline = [
    {
        $lookup: {
            from: 'users', // 참조할 컬렉션 이름
            localField: 'owner', // Image 컬렉션의 필드
            foreignField: '_id', // User 컬렉션의 필드
            as: 'ownerDetails', // 결과를 저장할 필드 이름
        }
    },
    {
        $unwind: '$ownerDetails' // 배열을 개별 문서로 펼침
    }
]

export const userLookupPipeline = [
    {
        $lookup: {
            from: 'users', // 참조할 컬렉션 이름
            localField: 'followers', // Image 컬렉션의 필드
            foreignField: '_id', // User 컬렉션의 필드
            as: 'followerUsers', // 결과를 저장할 필드 이름
        }
    },
    {
        $lookup: {
            from: 'users', // 참조할 컬렉션 이름
            localField: 'following', // Image 컬렉션의 필드
            foreignField: '_id', // User 컬렉션의 필드
            as: 'followingUsers', // 결과를 저장할 필드 이름
        }
    },
]

export async function getUserById(_id: string) {
    await dbConnect();
    return User.findOne({ _id })
}

export async function getUserBySub(sub: string) {
    await dbConnect();
    return User.findOne({ sub })
}

export async function createUser(user: UserInterface) {
    await dbConnect();
    const newUser: HydratedDocument<UserInterface> = new User(user);
    return newUser.save();
}

export async function getUserWithFollowInfo(_id: string, targetUserId: string) {

    await dbConnect();

    return await User.aggregate([
        { $match: { _id } },
        { "$addFields": { followersCount: { $size: "$followers" }}},
        { "$addFields": { followingCount: { $size: "$following" }}},
        { "$addFields": { followed: { $cond: { if: { $in: [targetUserId, "$followers"] }, then: true, else: false } }}},
    ])
}

export async function updateUserBySub(sub: string, updatedUserData: Partial<UserInterface>) {
    await dbConnect();
    const updatedUser = await User.findOneAndUpdate(
        { sub },
        { $set: updatedUserData },
        { new: true, runValidators: true }
    );
    return updatedUser;
}

export async function followUser(userId: string, targetUserId: string) {
    const result_1 = await User.updateOne(
        { _id: userId },
        {
            $addToSet: { following: targetUserId }
        }
    )

    if (!result_1.acknowledged || result_1.modifiedCount <= 0) {
        return false;
    }

    const result_2 = await User.updateOne(
        { _id: targetUserId },
        {
            $addToSet: { followers: userId }
        }
    )

    if (!result_2.acknowledged || result_2.modifiedCount <= 0) {
        return false;
    }

    return true;
}

export async function unFollowUser(userId: string, targetUserId: string) {
    const result_1 = await User.updateOne(
        { _id: userId },
        {
            $pull: { following: targetUserId }
        }
    )

    if (!result_1.acknowledged || result_1.modifiedCount <= 0) {
        return false;
    }

    const result_2 = await User.updateOne(
        { _id: targetUserId },
        {
            $pull: { followers: userId }
        }
    )

    if (!result_2.acknowledged || result_2.modifiedCount <= 0) {
        return false;
    }

    return true;
}

export async function addImageToUser(sub: string, imageId: string) {
    await dbConnect();
    await User.findOneAndUpdate(
        { sub },
        { $push: { images: imageId } }
    )
}

export async function deleteUserBySub(sub: string) {
    await dbConnect();
    await User.deleteOne({ sub });
}
