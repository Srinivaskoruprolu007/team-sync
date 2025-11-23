import { PermissionType, RoleEnum, RoleType } from "@/enums/role.enum";
import { RolePermssions } from "@/utils/roles-permission";
import mongoose, { Document, Schema } from "mongoose";

export interface RoleDocument extends Document {
    name: RoleType;
    permissions: Array<PermissionType>;
}

const RoleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: String,
            enum: Object.values(RoleEnum),
            required: true,
            unique: true,
        },
        permissions: {
            type: [String],
            enum: Object.values(Permissions),
            required: true,
            default: function (this: RoleDocument) {
                return RolePermssions[this.name];
            },
        },
    },
    {
        timestamps: true,
    }
);

const RoleModel = mongoose.model<RoleDocument>("Role", RoleSchema);
export default RoleModel;
