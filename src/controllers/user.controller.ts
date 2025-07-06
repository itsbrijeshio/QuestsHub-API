import { asyncHandler } from "../middlewares";
import { response, signCookie } from "../utils";
import { UserService, SubmissionService } from "../services";
import { AuthRequest } from "../types";

const submissionService = new SubmissionService();

class UserController extends UserService {
  constructor() {
    super();
  }

  handleGetMe = asyncHandler(async (req: AuthRequest, res) => {
    const { _id } = req.auth;
    const user = await this.getMe(_id);
    response(res, 200, { user });
  });

  handleGetAllByAdmin = asyncHandler(async (req: AuthRequest, res) => {
    const users = await this.getAllUsers(req.query);
    response(res, 200, { users });
  });

  handleGetXpByAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const xpLog = await this.getXpLog(userId);
    response(res, 200, xpLog);
  });

  handleGetXpByUser = asyncHandler(async (req: AuthRequest, res) => {
    const { _id } = req.auth;
    const { user, ...xpLog } = await this.getXpLog(_id);
    response(res, 200, xpLog);
  });
}

export default UserController;
