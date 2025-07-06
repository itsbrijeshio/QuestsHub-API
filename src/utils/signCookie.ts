import { Response } from "express";
import jwt from "jsonwebtoken";
import { envs } from "../config";

const signCookie = (
  res: Response,
  secret: { _id: string; role: string }
): string => {
  const token = jwt.sign(secret, envs.JWT_ACCESS_SECRET, {
    expiresIn: parseInt(envs.JWT_ACCESS_EXPIRES_IN) * 60 * 1000,
  });

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: parseInt(envs.JWT_ACCESS_EXPIRES_IN) * 60 * 1000,
  });
  return token;
};

export default signCookie;
