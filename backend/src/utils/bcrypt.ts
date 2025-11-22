import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltRound = 10) => {
    return await bcrypt.hash(value, saltRound);
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};
