import jwt from 'jsonwebtoken';

export function decodeJwt(token: string): string | jwt.JwtPayload | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY!);
    } catch (error) {
        return null;
    }
}
