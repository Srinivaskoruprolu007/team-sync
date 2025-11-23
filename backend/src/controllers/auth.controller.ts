import { asyncHandler } from "@/middleware/asyncHandler.middleware";
import { Request, Response } from "express";
import { env } from "@/utils/getEnv";

export const googleLoginCallback = asyncHandler(
    async (req: Request, res: Response) => {
        const currentWorkspace = req.user?.currentWorkspace;
        if (!currentWorkspace)
            return res.redirect(`${env.frontend_fallback_url}?status=failed`);
        return res.redirect(
            `${env.frontend_url}/workspace/${currentWorkspace}`
        );
    }
);
