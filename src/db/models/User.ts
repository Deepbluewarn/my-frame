import mongoose, { Schema, Types, Model } from 'mongoose';
import { ImageInterface } from '@/interface/Upload';
import { SerializedImageInterface } from './Image';

// 회원 인터페이스 정의
export interface UserInterface {
    sub: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    images?: ImageInterface[];
    followers?: Types.ObjectId[];
    following?: Types.ObjectId[];
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        website?: string;
    };
}

// 직렬화 가능한 타입으로 구성
export interface SerializedUserInterface extends Omit<UserInterface, 'images' | 'followers' | 'following'> {
    images: SerializedImageInterface[];
    followers: string[];
    following: string[];
}
type UserModel = Model<UserInterface>;

// 회원 스키마 정의
const UserSchema: Schema = new Schema<UserInterface, UserModel>({
    sub: { type: String, required: true, unique: true},
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    profilePicture: { type: String },
    bio: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }], 
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        website: { type: String }
    }
});

// 모델 생성
const User = mongoose.models.User as UserModel || mongoose.model<UserInterface, UserModel>('User', UserSchema);

export default User;
