import { ErrorOptions, ErrorProp, Status } from "../types";

class ApiError extends Error {
  public status: Status;
  public code: number;
  public error: ErrorProp;

  constructor(options: ErrorOptions) {
    super(options.message);
    this.status = options.status;
    this.code = options.code;
    this.error = options.error;
  }
}

export default ApiError;
