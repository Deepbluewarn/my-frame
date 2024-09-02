import mongoose, { Schema, Document } from 'mongoose';
import { ImageInterface } from '@/interface/Upload';

// 회원 인터페이스 정의
export interface UserInterface extends Document {
    sub: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    images?: ImageInterface[];
    followers?: mongoose.Schema.Types.ObjectId[];
    following?: mongoose.Schema.Types.ObjectId[];
    socialLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        website?: string;
    };
}

// 회원 스키마 정의
const UserSchema: Schema = new Schema({
    sub: { type: String, required: true, unique: true},
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    profilePicture: { type: String },
    bio: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }], 
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        website: { type: String }
    }
});

// 모델 생성
const User = mongoose.models.User || mongoose.model<UserInterface>('User', UserSchema);

export default User;
