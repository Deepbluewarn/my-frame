// app/api/auth/[auth0]/route.js
import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import connectDB from '@/db/init';
import { UserInterface } from '@/db/models/User';
import { createUser, getUserBySub, updateUserBySub } from '@/services/User';

const afterCallback = async (req: NextRequest, session: Session) => {
    await connectDB();

    const sub = session.user.sub;
    const userData: Partial<UserInterface> = {
        sub,
        username: session.user.nickname,
        email: session.user.email,
        profilePicture: session.user.picture,
    };

    const existingUser = await getUserBySub(sub);

    if (!existingUser) {
        createUser(userData);
    } else {
        userData.updatedAt = new Date();
        updateUserBySub(sub, userData);
    }
    
    return session;
};

export const GET = handleAuth({
    callback: handleCallback({ afterCallback })
});
