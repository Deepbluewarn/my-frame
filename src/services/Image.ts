import Image, { ImageInterface } from "@/db/models/Image";
import { UserInterface } from "@/db/models/User";
import { HydratedDocument, Types } from "mongoose";

interface ImageWithOwner extends ImageInterface {
    ownerDetails: UserInterface;
}

export async function createImage(image: ImageInterface) {
    const img: HydratedDocument<ImageInterface> = new Image(image);
    return img.save();
}

export async function getImage($match: { [key: string]: any }) {
    return await Image.aggregate<ImageWithOwner>([
        { $match },
        {
            $lookup: {
                from: 'users', // 참조할 컬렉션 이름
                localField: 'owner', // Image 컬렉션의 필드
                foreignField: '_id', // User 컬렉션의 필드
                as: 'ownerDetails' // 결과를 저장할 필드 이름
            }
        },
        {
            $unwind: '$ownerDetails' // 배열을 개별 문서로 펼침
        }
    ]);
}

export async function getImageById(_id: Types.ObjectId) {
    return (await getImage({ _id }))[0];
}

export async function getAllImagesByOwner(owner: string) {
    return await Image.find({ owner });
}

export async function getRecentImagesByOwner(owner: string, limit: number) {
    return (await Image.find({ owner }).sort({ createdAt: -1 }).limit(limit));
}

export async function getRecentPublicImages(limit: number) {
    return (await Image.find({ visibility: 'public' }).sort({ createdAt: -1 }).limit(limit));
}
