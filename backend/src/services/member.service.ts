import { ErrorCodeEnum } from '@/enums/error-code.enum';
import MemberModel from '@/models/member.model';
import WorkspaceModel from '@/models/workspace.model';
import { NotFoundException, UnauthorizedException } from '@/utils/appError';

export const getMemberRoleInWorkspace = async (userId: string, workspaceId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId).exec();
    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }
    const member = await MemberModel.findOne({
        userId,
        workspaceId,
    })
        .populate('role')
        .exec();
    if (!member) {
        throw new UnauthorizedException(
            'You are not a member of this workspace',
            ErrorCodeEnum.ACCESS_UNAUTHORIZED
        );
    }
    const roleName = member.role;
    return { roleName };
};
