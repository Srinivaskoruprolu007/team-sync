import passport from 'passport';
import { Request } from 'express';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { env } from '@/utils/getEnv';
import logger from '@/utils/logger';
import { NotFoundException } from '@/utils/appError';
import { ProvideEnum } from '@/enums/account-provider.enum';
import { loginOrCreateUser, verifyUser } from '@/services/auth.service';

passport.use(
    new GoogleStrategy(
        {
            clientID: env.google_client_id,
            clientSecret: env.google_client_secret,
            callbackURL: env.google_callback_url,
            scope: ['email', 'profile'],
            passReqToCallback: true,
        },
        async (
            req: Request,
            accessToken: string,
            refreshToken: string,
            profile: any,
            done: any
        ) => {
            try {
                // const { email, sub: googleId, picture } = profile._json();
                const email = profile.emails?.[0]?.value;
                const googleId = profile.id;
                const picture = profile.photos?.[0]?.value;
                logger.info(`Google user logged in: ${email}`);
                if (!googleId) {
                    logger.error('Google Id not found');
                    throw new NotFoundException('Google account not found');
                }
                logger.info(`Google Id ${googleId} found`);
                const { user } = await loginOrCreateUser({
                    provider: ProvideEnum.GOOGLE,
                    displayName: profile.displayName,
                    providerId: googleId,
                    picture,
                    email,
                });
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        },
        async (email: string, password: string, done: any) => {
            try {
                const user = await verifyUser({ email, password });
                if (!user) {
                    return done(null, false, { message: 'Invalid email or password' });
                }
                return done(null, user);
            } catch (error) {
                return done(error, false, { message: error.message });
            }
        }
    )
);

// passport.serializeUser((user: any, done) => {
//     done(null, user);
// });
// passport.deserializeUser((user: any, done) => {
//     done(null, user);
// });
