import UserModel from '@/models/user.model';
import { BadRequestException } from '@/utils/appError';
import logger from '@/utils/logger';

export const getCurrentUser = async (userId: string) => {
    const user = await UserModel.findById(userId).populate('currentWorkspace').select('-password');
    logger.info('user', { user });
    if (!user) {
        throw new BadRequestException('User not found');
    }
    return { user };
};
