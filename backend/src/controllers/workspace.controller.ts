import { HTTPSTATUS } from '@/config/http.config';
import { createWorkspaceSchema } from './../validation/workspace.validation';
import { asyncHandler } from '@/middleware/asyncHandler.middleware';
import { createWorkspace, getAllWorkspaces, getWorkspaceById } from '@/services/workspace.service';
import { Request, Response } from 'express';

export const createWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse({
        ...req.body,
    });
    const userId = req.user?.id;
    const { workspace } = await createWorkspace(body, userId);
    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Workspace created successfully',
        workspace,
    });
});

export const getAllWorkspacesController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const { workspaces } = await getAllWorkspaces(userId);
    return res.status(HTTPSTATUS.OK).json({
        data: {
            length: workspaces.length,
            workspaces,
        },
    });
});

export const getWorkspaceByIdController = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.id;
    if (!userId) return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
    const { workspace } = await getWorkspaceById(workspaceId, userId);
    return res.status(HTTPSTATUS.OK).json({
        data: {
            workspace,
        },
    });
});
