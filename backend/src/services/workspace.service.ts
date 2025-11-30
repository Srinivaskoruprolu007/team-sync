import { RoleEnum } from '@/enums/role.enum';
import RoleModel from '@/models/role.model';
import UserModel from '@/models/user.model';
import WorkspaceModel from '@/models/workspace.model';
import { NotFoundException } from '@/utils/appError';
import mongoose from 'mongoose';
import { addMemberToWorkspace } from '@/services/member.service';
import MemberModel from '@/models/member.model';

export const createWorkspace = async (
    body: { name: string; description?: string },
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

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const workspace = await new WorkspaceModel({
            name,
            description,
            owner: user._id,
        }).save({ session });

        await addMemberToWorkspace(user.id, workspace.id, ownerRole.id, session);

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user.save({ session });

        await session.commitTransaction();
        return { workspace };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};

// ✅ Added back getAllWorkspaces
export const getAllWorkspaces = async (userId: string) => {
    // Find all memberships for this user
    const memberships = await MemberModel.find({ userId }).select('workspaceId');
    const workspaceIds = memberships.map((m) => m.workspaceId);

    // Fetch workspaces by IDs
    const workspaces = await WorkspaceModel.find({ _id: { $in: workspaceIds } });

    return { workspaces };
};

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId).populate('owner').exec();

    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }

    // You can delegate member fetching to member.service if needed
    const members = await MemberModel.find({ workspaceId: workspace._id })
        .populate('userId', 'name email')
        .populate('role', 'name')
        .exec();

    return { workspace, members };
};
