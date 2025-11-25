import { env } from '@/utils/getEnv';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, env.session_secret, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, env.session_secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.session_secret);
};
