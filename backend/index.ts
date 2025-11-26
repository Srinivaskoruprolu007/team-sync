import express, { type NextFunction, type Request, type Response, type Application } from 'express';
import cors from 'cors';
import { env } from './src/utils/getEnv';
import connectDatabase from '@/config/db.config';
import logger from '@/utils/logger';
import { errorHandler } from '@/middleware/error.middleware';
import { HTTPSTATUS } from '@/config/http.config';
import { asyncHandler } from '@/middleware/asyncHandler.middleware';
import morgan from 'morgan';
import '@/config/passport.config';
import passport from 'passport';
import authRoute from '@/routes/auth.route';
import cookieParser from 'cookie-parser';
import userRoute from '@/routes/user.route';
import { authenticateJWT } from '@/middleware/auth.middleware';
import workspaceRoute from '@/routes/workspace.route';

const app: Application = express();
const BASE_PATH = env.base_path;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//     session({
//         name: "session",
//         keys: [env.session_secret],
//         maxAge: 24 * 60 * 60 * 1000,
//         secure: env.node_env === "production",
//         httpOnly: true,
//         sameSite: "lax",
//     })
// );

app.use(cookieParser());
app.use(passport.initialize());
// app.use(passport.session());

app.use(
    cors({
        origin: env.frontend_url,
        credentials: true,
    })
);

// logger middleware
app.use(morgan('combined'));
app.get(
    '/',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        res.status(HTTPSTATUS.OK).json({ message: 'Hello World!' });
    })
);

app.use(`${BASE_PATH}/auth`, authRoute);
app.use(`${BASE_PATH}/user`, authenticateJWT, userRoute);
app.use(`${BASE_PATH}/workspace`, authenticateJWT, workspaceRoute);

app.use(errorHandler);

app.listen(env.port, async () => {
    logger.info(`Server is running on http://localhost:${env.port} in ${BASE_PATH}`);
    await connectDatabase();
});
