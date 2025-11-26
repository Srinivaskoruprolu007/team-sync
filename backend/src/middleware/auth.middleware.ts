import { HTTPSTATUS } from '@/config/http.config';
import { verifyToken } from '@/utils/jwt';
import logger from '@/utils/logger';
import { Request, Response, NextFunction } from 'express';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
    const cookieToken = req?.cookies?.auth_token;
    logger.info('token', { bearerToken, cookieToken });
    const token = bearerToken || cookieToken;
    if (!token) {
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: 'missing token. Please provide token in header or cookie',
        });
    }
    try {
        const decoded = verifyToken(token);
        logger.info('decoded', { decoded });
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: 'Invalid token',
            error,
        });
    }
};
