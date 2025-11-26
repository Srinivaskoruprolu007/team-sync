import { createWorkspaceController } from '@/controllers/workspace.controller';
import { Router } from 'express';

const workspaceRoute = Router();

// route for creating a new workspace
workspaceRoute.post('/create/new', createWorkspaceController);

export default workspaceRoute;
