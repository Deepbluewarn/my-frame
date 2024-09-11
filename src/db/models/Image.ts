import mongoose, { Model, Schema, Types } from 'mongoose';

// 이미지 인터페이스 정의
export interface ImageInterface {
    url: string;
    width: number;
    height: number;
    title: string;
    description: string;
    tags: string[];
    owner: Types.ObjectId;
    uploadedAt: Date;
    likes?: number;
    comments?: {
        userId: Types.ObjectId;
        username: string;
        text: string;
        createdAt: Date;
    }[];
    visibility: 'public' | 'follow' | 'private';
}

type ImageModel = Model<ImageInterface>;

// 이미지 스키마 정의
export const ImageSchema: Schema = new Schema<ImageInterface, ImageModel>({
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            username: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    visibility: { type: String, enum: ['public', 'follow', 'private'], default: 'public' } // visibility 속성 추가
});

const Image = mongoose.models.Image as ImageModel || mongoose.model<ImageInterface, ImageModel>('Image', ImageSchema);

export default Image;