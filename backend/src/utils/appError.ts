import { ErrorCodeEnum, ErrorCodeEnumType } from "@/enums/error-code.enum";
import { HTTPSTATUS, HttpStatusCodeType } from "@/config/http.config";
export class AppError extends Error {
    public statusCode: HttpStatusCodeType;
    public errorCode?: ErrorCodeEnumType;

    constructor(
        statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
        message: string,
        errorCode?: ErrorCodeEnumType
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class HttpException extends AppError {
    constructor(
        message = "Http Exception Error",
        statusCode: HttpStatusCodeType,
        errorCode?: ErrorCodeEnumType
    ) {
        super(statusCode, message, errorCode);
    }
}

export class InternalServerException extends AppError {
    constructor(
        message = "Internal Server Error",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            message,
            errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
        );
    }
}

export class NotFoundException extends AppError {
    constructor(message = "Resource Not Found", errorCode?: ErrorCodeEnumType) {
        super(
            HTTPSTATUS.NOT_FOUND,
            message,
            errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
        );
    }
}

export class BadRequestException extends AppError {
    constructor(message = "Bad Request", errorCode?: ErrorCodeEnumType) {
        super(
            HTTPSTATUS.BAD_REQUEST,
            message,
            errorCode || ErrorCodeEnum.VALIDATION_ERROR
        );
    }
}

export class UnauthorizedException extends AppError {
    constructor(message = "Unauthorized", errorCode?: ErrorCodeEnumType) {
        super(
            HTTPSTATUS.UNAUTHORIZED,
            message,
            errorCode || ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS
        );
    }
}
