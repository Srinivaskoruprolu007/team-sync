import { v4 as uuid } from "uuid";

export const generateInviteCode = () =>
    uuid().replace(/-/g, "").substring(0, 8);

export const generateTaskCode = () =>
    `task-${uuid().replace(/-/g, "").substring(0, 3)}`;
