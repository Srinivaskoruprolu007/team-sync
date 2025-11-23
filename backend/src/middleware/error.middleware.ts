import { HTTPSTATUS } from "@/config/http.config";
import { ErrorCodeEnum } from "@/enums/error-code.enum";
import { AppError } from "@/utils/appError";
import logger from "@/utils/logger";
import { ErrorRequestHandler, Response } from "express";
import { ZodError } from "zod";

const formatZodError = (res: Response, error: ZodError) => {
    const errors = error?.issues?.map((issue) => ({
        message: issue.message,
        path: issue.path,
    }));
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: `Validation Error: ${error.message}`,
        errors,
        error: ErrorCodeEnum.VALIDATION_ERROR,
    });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    logger.error("Error handler triggered", {
        url: req.url,
        method: req.method,
        body: req.body, // careful: sanitize if sensitive
        error,
    });
    if (error instanceof ZodError) {
        return formatZodError(res, error);
    }

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
