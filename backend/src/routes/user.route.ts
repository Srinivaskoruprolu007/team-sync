import { getCurrentUserController } from '@/controllers/user.controller';
import { Router } from 'express';

const userRoute = Router();

userRoute.get('/current', getCurrentUserController);

export default userRoute;
