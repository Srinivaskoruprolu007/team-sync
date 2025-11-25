import { ErrorCodeEnum } from '@/enums/error-code.enum';
import { RoleEnum } from '@/enums/role.enum';
import AccountModel from '@/models/account.model';
import MemberModel from '@/models/member.model';
import RoleModel from '@/models/role.model';
import UserModel from '@/models/user.model';
import WorkspaceModel from '@/models/workspace.model';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@/utils/appError';
import mongoose from 'mongoose';
import { ProvideEnum } from '@/enums/account-provider.enum';
import logger from '@/utils/logger';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';

export const loginOrCreateUser = async (data: {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
}) => {
    const { providerId, displayName, picture, email, provider } = data;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        logger.info('starting loginOrCreateUser...', { email, provider });

        let user = await UserModel.findOne({ email }).session(session);

        if (!user) {
            user = await new UserModel({
                name: displayName,
                email,
                profilePicture: picture || null,
            }).save({ session });
            logger.info('New user created', { userId: user._id, email });

            await new AccountModel({
                userId: user._id,
                provider,
                providerId,
            }).save({ session });
            logger.info('Account linked', { provider, providerId });

            const workspace = await new WorkspaceModel({
                name: `${displayName}'s Workspace`,
                owner: user._id,
                description: `Workspace created by ${displayName}`,
            }).save({ session });
            logger.info('New workspace created', { workspaceId: workspace._id });

            const ownerRole = await RoleModel.findOne({
                name: RoleEnum.OWNER,
            }).session(session);
            if (!ownerRole) throw new NotFoundException('Owner role not found');

            await new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            }).save({ session });
            logger.info('Member added', { userId: user._id, workspaceId: workspace._id });

            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            await user.save({ session });
        } else {
            logger.info('Existed user found', { userId: user._id, email });
            const account = await AccountModel.findOne({
                userId: user._id,
                provider,
            }).session(session);
            if (!account) {
                logger.info('New provider account linked', { provider, providerId });
                await new AccountModel({
                    userId: user._id,
                    provider,
                    providerId,
                }).save({ session });
            }
        }

        // Issue tokens
        const accessToken = generateAccessToken({
            id: user._id.toString(),
            email: user.email,
            workspace: user.currentWorkspace,
        });
        const refreshToken = generateRefreshToken({ id: user._id });

        // Persist refresh token
        await AccountModel.findOneAndUpdate(
            { userId: user._id, provider, providerId },
            {
                refreshToken,
                tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            { session, upsert: true }
        );

        await session.commitTransaction();
        logger.info('Transaction committed successfully', { userId: user._id });

        return { user, workspaceId: user.currentWorkspace, accessToken, refreshToken };
    } catch (error) {
        await session.abortTransaction();
        logger.error('Error in loginOrCreateUser', { error, email, provider });
        throw error;
    } finally {
        session.endSession();
    }
};

export const registerUser = async (body: { name: string; email: string; password: string }) => {
    const { name, email, password } = body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        logger.info('starting registerUser...', { email });

        const existedUser = await UserModel.findOne({ email }).session(session);
        if (existedUser) {
            logger.info('User already exists', { email });
            throw new BadRequestException(
                'User already exists',
                ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS
            );
        }

        const user = new UserModel({ email, name, password });
        await user.save({ session });
        logger.info('User created', { userId: user._id, email });

        const account = new AccountModel({
            userId: user._id,
            provider: ProvideEnum.EMAIL,
            providerId: email,
        });
        await account.save({ session });
        logger.info('Account linked', { provider: ProvideEnum.EMAIL, providerId: email });

        const workspace = new WorkspaceModel({
            name: `${name}'s Workspace`,
            owner: user._id,
            description: `Workspace created by ${name}`,
        });
        await workspace.save({ session });
        logger.info('New workspace created', { workspaceId: workspace._id });

        const ownerRole = await RoleModel.findOne({ name: RoleEnum.OWNER }).session(session);
        if (!ownerRole) throw new NotFoundException('Owner role not found');

        const member = new MemberModel({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date(),
        });
        await member.save({ session });
        logger.info('Member added', { userId: user._id, workspaceId: workspace._id });

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user.save({ session });

        // Issue tokens
        const accessToken = generateAccessToken({
            id: user._id.toString(),
            email: user.email,
            workspace: user.currentWorkspace,
        });
        const refreshToken = generateRefreshToken({ id: user._id });

        await AccountModel.findOneAndUpdate(
            { userId: user._id, provider: ProvideEnum.EMAIL, providerId: email },
            {
                refreshToken,
                tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            { session, upsert: true }
        );

        await session.commitTransaction();
        logger.info('Transaction committed successfully', { userId: user._id });

        return { userId: user._id, workspaceId: user.currentWorkspace, accessToken, refreshToken };
    } catch (error) {
        await session.abortTransaction();
        logger.error('Error in registerUser', { error, email });
        throw error;
    } finally {
        await session.endSession();
    }
};

export const verifyUser = async ({
    email,
    password,
    provider = ProvideEnum.EMAIL,
}: {
    email: string;
    password: string;
    provider?: string;
}) => {
    const account = await AccountModel.findOne({ provider, providerId: email });
    if (!account) {
        throw new NotFoundException('Invalid email or password');
    }
    const user = await UserModel.findById(account.userId);
    if (!user) {
        throw new NotFoundException('User not found for given account');
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        throw new UnauthorizedException('Invalid email or password');
    }

    // Issue tokens here too if needed
    const accessToken = generateAccessToken({
        id: user._id.toString(),
        email: user.email,
        workspace: user.currentWorkspace,
    });
    const refreshToken = generateRefreshToken({ id: user._id });

    await AccountModel.findOneAndUpdate(
        { userId: user._id, provider, providerId: email },
        {
            refreshToken,
            tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        { upsert: true }
    );

    return { user: user.omitPassword(), accessToken, refreshToken };
};
