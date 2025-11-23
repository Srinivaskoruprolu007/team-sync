import { ErrorCodeEnum } from "@/enums/error-code.enum";
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

        let user = await UserModel.findOne({ email }).session(session);

        if (!user) {
            user = await new UserModel({
                name: displayName,
                email,
                profilePicture: picture || null,
            }).save({ session });

            await new AccountModel({
                userId: user._id,
                provider,
                providerId,
            }).save({ session });

            const workspace = await new WorkspaceModel({
                name: `${displayName}'s Workspace`,
                owner: user._id,
                description: `Workspace created by ${displayName}`,
            }).save({ session });

            const ownerRole = await RoleModel.findOne({
                name: RoleEnum.OWNER,
            }).session(session);
            if (!ownerRole) throw new NotFoundException("Owner role not found");

            await new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            }).save({ session });

            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            await user.save({ session });
        } else {
            const account = await AccountModel.findOne({
                userId: user._id,
                provider,
            }).session(session);
            if (!account) {
                await new AccountModel({
                    userId: user._id,
                    provider,
                    providerId,
                }).save({ session });
            }
        }

        await session.commitTransaction();
        return { user, workspaceId: user.currentWorkspace };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
