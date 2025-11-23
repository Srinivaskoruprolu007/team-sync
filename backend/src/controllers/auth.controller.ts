import jwt from "jsonwebtoken";
import { asyncHandler } from "@/middleware/asyncHandler.middleware";
import { Request, Response } from "express";
import { env } from "@/utils/getEnv";

export const googleLoginCallback = asyncHandler(
    async (req: Request, res: Response) => {
        const user = req.user as any;
        if (!user || !user.currentWorkspace) {
            return res.redirect(`${env.frontend_fallback_url}?status=failed`);
        }
        //  Issue JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                workspace: user.currentWorkspace,
            },
            env.session_secret,
            { expiresIn: env.session_expiration }
        );
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: env.node_env === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.redirect(
            `${env.frontend_url}/workspace/${user.currentWorkspace}`
        );
    }
);
