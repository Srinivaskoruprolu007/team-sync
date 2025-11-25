import { HTTPSTATUS } from '@/config/http.config';
import { asyncHandler } from '@/middleware/asyncHandler.middleware';
import { NextFunction, Request, Response } from 'express';
import { env } from '@/utils/getEnv';
import { registerSchema } from '@/validation/auth.validation';
import { registerUser } from '@/services/auth.service';
import passport from 'passport';
import { generateAccessToken, generateRefreshToken, verifyToken } from '@/utils/jwt';
import AccountModel from '@/models/account.model';
import { ProvideEnum } from '@/enums/account-provider.enum';
import logger from '@/utils/logger';

export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as any;
    if (!user || !user.currentWorkspace) {
        res.redirect(`${env.frontend_fallback_url}?status=failed`);
        return;
    }
    const accessToken = generateAccessToken({
        id: user._id,
        email: user.email,
        workspace: user.currentWorkspace,
    });
    const refreshToken = generateRefreshToken({ id: user._id });
    await AccountModel.findOneAndUpdate(
        { userId: user._id, provider: ProvideEnum.GOOGLE, providerId: user.email },
        { refreshToken, tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    );
    res.cookie('auth_token', accessToken, {
        httpOnly: true,
        secure: env.node_env === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: env.node_env === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${env.frontend_url}/workspace/${user.currentWorkspace}`);
});
export const registerUserController = asyncHandler(async (req: Request, res: Response) => {
    const body = registerSchema.parse({
        ...req.body,
    });

    const { userId, workspaceId, accessToken, refreshToken } = await registerUser(body);
    res.status(HTTPSTATUS.CREATED).json({
        message: 'User registered successfully',
        data: { userId, workspaceId, accessToken, refreshToken },
    });
});

export const loginController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            'local',
            async (
                err: Error | null,
                user: Express.User | false,
                info: { message: string } | undefined
            ) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: info?.message });
                }
                // access + refresh tokens
                const accessToken = generateAccessToken({ id: user._id, email: user.email });
                const refreshToken = generateRefreshToken({ id: user._id });

                await AccountModel.findOneAndUpdate(
                    { provider: ProvideEnum.EMAIL, providerId: user.email },
                    { refreshToken, tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
                );
                return res.status(HTTPSTATUS.OK).json({
                    message: 'Login successful',
                    data: {
                        accessToken,
                        refreshToken,
                        user,
                    },
                });
            }
        )(req, res, next);
    }
);

// refresh token
export const refreshController = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken || req.cookies.refresh_token;
    logger.info('refresh token', { refreshToken });
    if (!refreshToken)
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Missing refresh token' });
    try {
        const decoded = verifyToken(refreshToken);
        logger.info('decoded', { decoded });
        const account = await AccountModel.findOne({
            userId: decoded.id,
            refreshToken,
        });
        if (!account)
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
        if (account.tokenExpiry && account.tokenExpiry.getTime() < Date.now()) {
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Refresh token expired' });
        }
        const newAccessToken = generateAccessToken({ id: decoded._id, email: decoded.email });
        res.cookie('auth_token', newAccessToken, {
            httpOnly: true,
            secure: env.node_env === 'production',
            sameSite: 'lax',
            maxAge: 7 * 60 * 60 * 1000,
        });
        return res.status(HTTPSTATUS.OK).json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
    }
});

// logout
export const logoutController = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken || req.cookies.refresh_token;
    if (refreshToken) {
        await AccountModel.findOneAndUpdate(
            { refreshToken },
            { refreshToken: null, tokenExpiry: null }
        );
        res.clearCookie('auth_token');
        res.clearCookie('refresh_token');
        return res.status(HTTPSTATUS.OK).json({ message: 'Logout successful' });
    }
});
