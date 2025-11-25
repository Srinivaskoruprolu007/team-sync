import { HTTPSTATUS } from '@/config/http.config';
import { asyncHandler } from '@/middleware/asyncHandler.middleware';
import { getCurrentUser } from '@/services/user.service';
import logger from '@/utils/logger';
import { Request, Response } from 'express';

export const getCurrentUserController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    logger.info('userId', { userId });
    const { user } = await getCurrentUser(userId);
    return res.status(HTTPSTATUS.OK).json({ user });
});
