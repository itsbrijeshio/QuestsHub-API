import { Response } from "express";

const response = (
  res: Response,
  statusCode: number,
  data: any = undefined,
  rest?: any
): Response => {
  const message = data?.message || "Success";
  data.message && delete data.message;
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...rest,
  });
};

export default response;
