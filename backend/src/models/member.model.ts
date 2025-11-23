import mongoose, { Document, Schema } from "mongoose";

export interface MemberDocument extends Document {
    userId: mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    // role: string; //TODO create Role Document
    joinedAt: Date;
}

const MemberSchema = new Schema<MemberDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    // role: {
    //     type: String,
    //     required: true,
    // },
    joinedAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});

const MemberModel = mongoose.model<MemberDocument>("Member", MemberSchema);
export default MemberModel;
