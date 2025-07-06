import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";
import { ApiError } from "../utils";
import asyncHandler from "./asyncHandler";
import { envs } from "../config";

const authGuard: any = asyncHandler(async (req: AuthRequest, res, next) => {
  const token = req.headers?.["x-access-token"]?.toString();
  const accessToken = req.cookies?.["access_token"] || token?.split(" ")[1];

  if (!accessToken) {
    throw new ApiError({
      status: "fail",
      code: 401,
      message: "Unauthorized",
      error: { type: "AuthenticationError", details: null },
    });
  }

  const decoded: any = jwt.verify(accessToken, envs.JWT_ACCESS_SECRET);
  req.auth = { _id: decoded._id, role: decoded?.role };

  if (!req.auth?._id) {
    throw new ApiError({
      status: "fail",
      code: 401,
      message: "Unauthorized",
      error: { type: "AuthenticationError", details: null },
    });
  }
  next();
});

const roleGuard = (roles: string[]) =>
  asyncHandler(async (req: AuthRequest, res, next) => {
    const role = req.auth?.role || "";
    if (!roles.includes(role)) {
      throw new ApiError({
        status: "fail",
        code: 403,
        message: "Forbidden",
        error: { type: "ForbiddenError", details: null },
      });
    }
    next();
  });

authGuard.roleGuard = roleGuard;

export default authGuard;
