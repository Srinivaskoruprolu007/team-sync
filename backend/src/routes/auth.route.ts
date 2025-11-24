import {
    googleLoginCallback,
    registerUserController,
} from "@/controllers/auth.controller";
import { env } from "@/utils/getEnv";
import { Router } from "express";
import passport from "passport";

const fallbackUrl = `${env.frontend_fallback_url}?status=failed`;
const authRoute = Router();

authRoute.post("/register", registerUserController);

authRoute.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
        session: false,
    })
);

authRoute.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: fallbackUrl,
        session: false,
    }),
    googleLoginCallback
);

export default authRoute;
