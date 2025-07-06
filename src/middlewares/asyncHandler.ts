import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError, ZodIssue } from "zod";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { ApiError, logger } from "../utils";
import { ErrorOptions } from "../types";

// Types
interface ErrorFormatterResult extends ErrorOptions {
  statusCode: number;
}

type ErrorFormatter = (error: unknown) => ErrorFormatterResult;

type AsyncFn<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Format Zod validation errors
const formatZodError = (zodError: ZodError) => {
  return zodError.issues?.reduce<Record<string, any>>(
    (acc, issue: ZodIssue) => {
      const path = issue.path.join(".");
      acc[path] = {
        code: issue.code,
        message: issue.message,
        expected: (issue as any).expected,
        received: (issue as any).received,
      };
      return acc;
    },
    {}
  );
};

// Default error formatting
const defaultErrorFormatter: ErrorFormatter = (
  error: unknown
): ErrorFormatterResult => {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      status: "fail",
      code: 400,
      message: "Validation error",
      error: {
        type: "ValidationError",
        details: formatZodError(error),
      },
    };
  } else if (error instanceof ApiError) {
    return {
      statusCode: error.code,
      status: error.status,
      code: error.code,
      message: error.message,
      error: error.error,
    };
  } else if (
    error instanceof JsonWebTokenError ||
    error instanceof TokenExpiredError ||
    error instanceof NotBeforeError
  ) {
    return {
      statusCode: 401,
      status: "fail",
      code: 401,
      message: "Unauthorized",
      error: { type: "AuthenticationError", details: null },
    };
  }
  return {
    statusCode: 500,
    status: "error",
    code: 500,
    message: "Internal server error",
    error: { type: "InternalError", details: null },
  };
};

// Async handler wrapper
const asyncHandler =
  <T extends Request = Request>(
    fn: AsyncFn<T>,
    errorFormatter: ErrorFormatter = defaultErrorFormatter
  ): RequestHandler =>
  async (req, res: Response, next: NextFunction): Promise<any> => {
    try {
      await fn(req as T, res, next);
    } catch (error: any) {
      const { statusCode, ...rest } = errorFormatter(error);

      if (statusCode === 500) {
        console.log("Error: ", error);
        logger.error(
          `${error.message} - ${req.path} - ${req.method} - ${req.ip}`
        );
      }

      return res.status(statusCode).json({
        ...rest,
        success: false,
      });
    }
  };

export default asyncHandler;
