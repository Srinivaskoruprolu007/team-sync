import {
    googleLoginCallback,
    loginController,
    logoutController,
    refreshController,
    registerUserController,
} from '@/controllers/auth.controller';
import { authenticateJWT } from '@/middleware/auth.middleware';
import { env } from '@/utils/getEnv';
import { Router } from 'express';
import passport from 'passport';

const fallbackUrl = `${env.frontend_fallback_url}?status=failed`;
const authRoute = Router();

authRoute.post('/register', registerUserController);

authRoute.post('/login', loginController);

authRoute.post('/refresh', refreshController);

authRoute.post('/logout', logoutController);

authRoute.get(
    '/google',
    passport.authenticate('google', {
        scope: ['email', 'profile'],
        session: false,
    })
);

authRoute.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: fallbackUrl,
        session: false,
    }),
    googleLoginCallback
);

export default authRoute;
