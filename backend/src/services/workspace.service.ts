import { RoleEnum } from '@/enums/role.enum';
import MemberModel from '@/models/member.model';
import RoleModel from '@/models/role.model';
import UserModel from '@/models/user.model';
import WorkspaceModel from '@/models/workspace.model';
import { ForbiddenException, NotFoundException } from '@/utils/appError';
import mongoose from 'mongoose';

export const createWorkspace = async (
    body: { name: string; description?: string | undefined },
    userId: string
) => {
    const { name, description } = body;
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    const ownerRole = await RoleModel.findOne({ name: RoleEnum.OWNER });
    if (!ownerRole) {
        throw new NotFoundException('Owner role not found');
    }
    const workspace = new WorkspaceModel({
        name,
        description,
        owner: user._id,
    });
    await workspace.save();
    const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
    });
    await member.save();
    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save();
    return { workspace };
};

export const getAllWorkspaces = async (userId: string) => {
    const memberships = await MemberModel.find({ userId })
        .populate('workspaceId')
        .select('-password')
        .exec();
    const workspaces = memberships.map((membership) => membership.workspaceId);
    return { workspaces };
};

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId).populate('owner').exec();
    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }
    const isMember = await MemberModel.findOne({ workspaceId: workspace._id, userId });
    if (!isMember) {
        throw new ForbiddenException('You are not a member of this workspace');
    }
    return { workspace };
};
