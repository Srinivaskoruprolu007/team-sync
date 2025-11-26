import { HTTPSTATUS } from '@/config/http.config';
import { createWorkspaceSchema } from './../validation/workspace.validation';
import { asyncHandler } from '@/middleware/asyncHandler.middleware';
import { createWorkspace } from '@/services/workspace.service';
import { Request, Response } from 'express';
import logger from '@/utils/logger';

export const createWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse({
        ...req.body,
    });
    const user = req.user as any;
    const userId = req.user?._id;
    logger.info('user', { user });

    const { workspace } = await createWorkspace(body, userId);
    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Workspace created successfully',
        workspace,
    });
});
