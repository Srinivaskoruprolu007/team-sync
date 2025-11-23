import { Permissions, PermissionType, RoleType } from "@/enums/role.enum";

export const RolePermssions: Record<RoleType, Array<PermissionType>> = {
    ADMIN: [
        Permissions.ADD_MEMBER,
        Permissions.MANAGE_WORKSPACE_SETTINGS,
        Permissions.CREATE_PROJECT,
        Permissions.DELETE_PROJECT,
        Permissions.EDIT_PROJECT,
        Permissions.CREATE_TASK,
        Permissions.DELETE_TASK,
        Permissions.EDIT_TASK,
        Permissions.VIEW_ONLY,
    ],
    MEMBER: [
        Permissions.VIEW_ONLY,
        Permissions.CREATE_TASK,
        Permissions.EDIT_TASK,
    ],
    OWNER: [
        Permissions.CREATE_WORKSPACE,
        Permissions.DELETE_WORKSPACE,
        Permissions.EDIT_WORKSPACE,
        Permissions.MANAGE_WORKSPACE_SETTINGS,

        Permissions.CREATE_PROJECT,
        Permissions.EDIT_PROJECT,
        Permissions.DELETE_PROJECT,

        Permissions.CREATE_TASK,
        Permissions.DELETE_TASK,
        Permissions.EDIT_TASK,

        Permissions.ADD_MEMBER,
        Permissions.REMOVE_MEMBER,
        Permissions.CHANGE_MEMBER_ROLE,

        Permissions.VIEW_ONLY,
    ],
};
