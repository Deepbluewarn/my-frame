import mongoose, { Schema, Types, Model } from 'mongoose';

export interface IUserInfo {
    profilePicture: string;
    username: string;
    sub: string;
}
// 회원 인터페이스 정의
export interface UserInterface {
    _id: string;
    sub: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    followers?: string[];
    following?: string[];
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        website?: string;
    };
}

type UserModel = Model<UserInterface>;

// 회원 스키마 정의
const UserSchema: Schema = new Schema<UserInterface, UserModel>({
    _id: { type: String, default: new Types.ObjectId().toString()},
    sub: { type: String, required: true, unique: true},
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    profilePicture: { type: String },
    bio: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    followers: [{ type: String, ref: 'User' }],
    following: [{ type: String, ref: 'User' }],
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
