import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils";
import asyncHandler from "./asyncHandler";
import { envs } from "../config";
import { AuthRequest } from "../types";

const authRefreshToken = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const refreshToken = req.headers?.["x-refresh-token"]?.toString();
    if (!refreshToken) {
      throw new ApiError({
        status: "fail",
        code: 401,
        message: "Unauthorized",
        error: { type: "AuthenticationError", details: null },
      });
    }

    const decoded: any = jwt.verify(refreshToken, envs.JWT_REFRESH_SECRET);
    req.auth = { _id: decoded?._id };
    req.temp = { refreshToken };

    if (!req.auth?._id || !req.temp?.refreshToken) {
      throw new ApiError({
        status: "fail",
        code: 401,
        message: "Unauthorized",
        error: { type: "AuthenticationError", details: null },
      });
    }
    next();
  }
);

export default authRefreshToken;
