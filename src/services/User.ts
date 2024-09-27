import User, { UserInterface } from "@/db/models/User";
import { Types, HydratedDocument } from "mongoose";

const convertIdPipeline = [
    {
        $addFields: {
            id: { $toString: '$_id' },
        }
    },
    {
        $project: {
            _id: 0,
        }
    },
]
const projectUserInfo = [
    {
        // 아래 속성은 ObjectId를 포함하는 배열이기 때문에 직렬화 불가능.
        $project: {
            images: 0,
            followers: 0,
            following: 0,
        }
    }
]

export const userLookupPipeline = [
    {
        $lookup: {
            from: 'users', // 참조할 컬렉션 이름
            localField: 'owner', // Image 컬렉션의 필드
            foreignField: '_id', // User 컬렉션의 필드
            as: 'ownerDetails', // 결과를 저장할 필드 이름
            pipeline: [
                ...convertIdPipeline,
                ...projectUserInfo,
            ]
        }
    },
    {
        $unwind: '$ownerDetails' // 배열을 개별 문서로 펼침
    }
]

export function getUserBySub(sub: string) {
    return User.findOne({ sub })
}

export async function createUser(user: UserInterface) {
    const newUser: HydratedDocument<UserInterface> = new User(user);
    return newUser.save();
}

export async function updateUserBySub(sub: string, updatedUserData: Partial<UserInterface>) {
    const updatedUser = await User.findOneAndUpdate(
        { sub },
        { $set: updatedUserData },
        { new: true, runValidators: true }
    );
    return updatedUser;
}

export async function addImageToUser(sub: string, imageId: string) {
    await User.findOneAndUpdate(
        { sub },
        { $push: { images: imageId } }
    )
}

export async function deleteUserBySub(sub: string) {
    await User.deleteOne({ sub });
}
