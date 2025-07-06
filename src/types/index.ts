import { Request } from "express";

export type ErrorType =
  | "ValidationError"
  | "AuthenticationError"
  | "AuthorizationError"
  | "NotFoundError"
  | "ConflictError"
  | "RateLimitError"
  | "InternalError"
  | "DatabaseError"
  | "ThirdPartyError"
  | "ForbiddenError";

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export type Status = "success" | "fail" | "error";

export type ErrorProp = {
  type: ErrorType;
  details?: any;
};

export type ErrorOptions = {
  status: Status;
  code: HttpStatusCode;
  message: string;
  error: ErrorProp;
};

export interface AuthRequest
  extends Request<any, any, any, any, Record<string, any>> {
  auth: {
    _id: string;
    role?: string;
  };
  temp?: any;
}
