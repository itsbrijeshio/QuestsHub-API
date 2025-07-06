import { NextFunction, Request, Response } from "express";
import asyncHandler from "./asyncHandler";
import { Types } from "mongoose";
import { ApiError } from "../utils";
import { Schema } from "zod";

type Source = "body" | "params" | "query";

const validateRequest = (schema: Schema, source: Source = "body") =>
  asyncHandler(async (req, res, next) => {
    const values = req[source];
    await schema.parseAsync(values);
    next();
  });

const isValidId = (prop = "id", source: Source = "params", name = "ID") =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req[source][prop];

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError({
        status: "fail",
        code: 400,
        message: `${name} ID is invalid`,
        error: { type: "ValidationError", details: null },
      });
    }

    next();
    return id;
  });

validateRequest.isValidId = isValidId;

export default validateRequest;
