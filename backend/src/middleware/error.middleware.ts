import { HTTPSTATUS } from "@/config/http.config";
import { AppError } from "@/utils/appError";
import logger from "@/utils/logger";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res) => {
    logger.error(
        `Error handler called on request ${req.url} with ${req.body}`,
        error
    );
    if (error instanceof SyntaxError)
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid JSON format. Please check your request body",
        });
    if (error instanceof AppError)
        return res
            .status(error.statusCode)
            .json({ message: error.message, error: error.errorCode });
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Unknow Error occured",
    });
};
