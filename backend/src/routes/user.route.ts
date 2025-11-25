import { getCurrentUserController } from '@/controllers/user.controller';
import { authenticateJWT } from '@/middleware/auth.middleware';
import { Router } from 'express';

const userRoute = Router();

userRoute.get('/current', authenticateJWT, getCurrentUserController);

export default userRoute;
