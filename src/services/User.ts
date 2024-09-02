import User, { UserInterface } from "@/db/models/User";

export function getUserBySub(sub: string) {
    return User.findOne({ sub })
}

export async function createUser(user: Partial<UserInterface>) {
    const newUser = new User(user);
    await newUser.save();
}

export async function updateUserBySub(sub: string, updatedUserData: Partial<UserInterface>) {
    const updatedUser = await User.findOneAndUpdate(
        { sub },
        { $set: updatedUserData },
        { new: true, runValidators: true }
    );
    return updatedUser;
}

export async function deleteUserBySub(sub: string) {
    await User.deleteOne({ sub });
}
