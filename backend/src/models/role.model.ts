import { PermissionType, RoleType } from '@/enums/role.enum';
import { Document } from 'mongoose';

export interface RoleDocument extends Document{
    name:RoleType;
    permissions:Array<PermissionType>;
}
