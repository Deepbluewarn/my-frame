import User, { UserInterface } from "@/db/models/User";
import { Types, HydratedDocument } from "mongoose";

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

export async function addImageToUser(sub: string, imageId: Types.ObjectId) {
    await User.findOneAndUpdate(
        { sub },
        { $push: { images: imageId } }
    )
}

export async function deleteUserBySub(sub: string) {
    await User.deleteOne({ sub });
}
