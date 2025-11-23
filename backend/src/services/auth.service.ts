import { RoleEnum } from "@/enums/role.enum";
import AccountModel from "@/models/account.model";
import MemberModel from "@/models/member.model";
import RoleModel from "@/models/role.model";
import UserModel from "@/models/user.model";
import WorkspaceModel from "@/models/workspace.model";
import { NotFoundException } from "@/utils/appError";
import mongoose from "mongoose";

export const loginOrCreateUser = async (data: {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
}) => {
    const { providerId, displayName, picture, email, provider } = data;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        let user = await UserModel.findOne({ email });
        if (!user) {
            user = new UserModel({
                name: displayName,
                email,
                profilePicture: picture || null,
            });
            await user.save({ session });
            const account = new AccountModel({
                userId: user._id,
                provider,
                providerId,
            });
            await account.save({ session });
            const workspace = new WorkspaceModel({
                name: `${displayName}'s Workspace`,
                owner: user._id,
                description: `Workspace created by ${displayName}`,
            });
            await workspace.save({ session });
            const ownerRole = await RoleModel.findOne({
                name: RoleEnum.OWNER,
            }).session(session);
            if (!ownerRole) {
                throw new NotFoundException("Owner role not found");
            }
            const member = new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            });
            await member.save({ session });
            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            await user.save({ session });
        }
        await session.commitTransaction();
        await session.endSession();
        return { user };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new NotFoundException("User not found");
    }
};

