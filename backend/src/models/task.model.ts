import {
    TaskPriorityEnum,
    TaskPriorityEnumType,
    TaskStatusEnum,
    TaskStatusEnumType,
} from "@/enums/task-status.enum";
import { generateTaskCode } from "@/utils/uuid";
import mongoose, { Document, Schema } from "mongoose";

export interface TaskDocument extends Document {
    taskCode: string;
    title: string;
    description: string | null;
    project: mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId | null;
    status: TaskStatusEnumType;
    priority: TaskPriorityEnumType;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<TaskDocument>(
    {
        taskCode: {
            type: String,
            required: true,
            unique: true,
            default: generateTaskCode,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        status: {
            type: String,
            enum: Object.values(TaskStatusEnum),
            required: true,
            default: TaskStatusEnum.TODO,
        },
        priority: {
            type: String,
            enum: Object.values(TaskPriorityEnum),
            required: true,
            default: TaskPriorityEnum.MEDIUM,
        },
        dueDate: {
            type: Date,
            required: false,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const TaskModel = mongoose.model<TaskDocument>("Task", TaskSchema);
export default TaskModel;
