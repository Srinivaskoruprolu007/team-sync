import MemberModel from '@/models/member.model';
import WorkspaceModel from '@/models/workspace.model';
import { NotFoundException, ForbiddenException } from '@/utils/appError';
import mongoose from 'mongoose';

export const addMemberToWorkspace = async (
    userId: string,
    workspaceId: string,
    roleId: string,
    session?: mongoose.ClientSession
) => {
    return new MemberModel({
        userId,
        workspaceId,
        role: roleId,
        joinedAt: new Date(),
    }).save({ session });
};

export const getMembersInWorkspace = async (workspaceId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId).exec();
    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }

    const members = await MemberModel.find({ workspaceId })
        .populate('userId', 'name email')
        .populate('role', 'name')
        .exec();

    return { members };
};

export const getMemberRoleInWorkspace = async (
    userId: string,
    workspaceId: string
): Promise<{ roleName: string }> => {
    const workspace = await WorkspaceModel.findById(workspaceId).exec();
    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }

    const member = await MemberModel.findOne({ userId, workspaceId }).populate('role').exec();

    if (!member) {
        throw new ForbiddenException('You are not a member of this workspace');
    }

    const roleName = (member.role as any).name;
    return { roleName };
};
