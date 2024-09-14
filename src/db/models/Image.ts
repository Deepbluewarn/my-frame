import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IComment {
    userId: Types.ObjectId;
    username: string;
    text: string;
    createdAt: Date;
}

export interface ISerializedComment extends Omit<IComment, 'userId'> {
    userId: string;
}

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
    comments?: IComment[];
    visibility: 'public' | 'follow' | 'private';
}

// Aggregate 메소드로 생성된 객체를 위한 인터페이스, 직렬화 가능한 타입으로 구성.
// service 함수를 server action으로 바로 사용하려면 반환 값이 직렬화 가능해야 함.
export interface SerializedImageInterface extends Omit<ImageInterface, 'id' | 'owner' | 'comments'> {
    id: string;
    owner: string;
    comments: ISerializedComment[];
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