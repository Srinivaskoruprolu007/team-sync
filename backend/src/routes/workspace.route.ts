import { createWorkspaceController, getAllWorkspacesController, getWorkspaceByIdController } from '@/controllers/workspace.controller';
import { Router } from 'express';

const workspaceRoute = Router();

// route for creating a new workspace
workspaceRoute.post('/create/new', createWorkspaceController);

// get all workspaces
workspaceRoute.get("/all", getAllWorkspacesController);

workspaceRoute.get("/:workspaceId", getWorkspaceByIdController);

export default workspaceRoute;
