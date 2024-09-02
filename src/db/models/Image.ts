import mongoose, { Schema } from 'mongoose';

// 이미지 인터페이스 정의
export interface ImageInterface {
    url: string;
    title: string;
    description: string;
    tags: string[];
    uploadedAt: Date;
    likes: number;
    comments: {
        userId: mongoose.Schema.Types.ObjectId;
        username: string;
        text: string;
        createdAt: Date;
    }[];
    visibility: 'public' | 'follow' | 'private';
}

// 이미지 스키마 정의
const ImageSchema: Schema = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    uploadedAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            username: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    visibility: { type: String, enum: ['public', 'follow', 'private'], default: 'public' } // visibility 속성 추가
});

export default ImageSchema;