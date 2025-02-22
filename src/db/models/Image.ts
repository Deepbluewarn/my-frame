import mongoose, { Model, Schema, Types } from 'mongoose';
import { IUserInfo } from './User';

export type Visibility = 'public' | 'follow' | 'private';
export const visibilityArray: Visibility[] = ['public', 'follow', 'private'];

export interface IComment {
    _id: string;
    commenter: string | IUserInfo;
    text: string;
    createdAt: Date;
}

// 이미지 인터페이스 정의
export interface ImageInterface {
    _id: string;
    url: string;
    s3_key: string;
    width: number;
    height: number;
    title: string;
    description: string;
    tags: string[];
    owner: string;
    uploadedAt: Date;
    likes?: string[];
    comments: IComment[];
    visibility: Visibility;
}

type ImageModel = Model<ImageInterface>;

// 이미지 스키마 정의
export const ImageSchema: Schema = new Schema<ImageInterface, ImageModel>({
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    url: { type: String, required: true },
    s3_key: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    tags: { type: [String], required: true },
    owner: { type: String, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now },
    likes: { type: [String], ref: 'User', },
    comments: [
        {
            _id: { type: String, default: () => new Types.ObjectId().toString() },
            commenter: { type: String, ref: 'User', required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    visibility: { type: String, enum: visibilityArray, default: 'public' } // visibility 속성 추가
});

const Image = mongoose.models.Image as ImageModel || mongoose.model<ImageInterface, ImageModel>('Image', ImageSchema);

export default Image;