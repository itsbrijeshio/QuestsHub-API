import { asyncHandler } from "../middlewares";
import { response, signCookie } from "../utils";
import { UserService } from "../services";
import { AuthRequest } from "../types";

class AuthController extends UserService {
  constructor() {
    super();
  }

  handleRegister = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await this.register({ name, email, password });
    response(res, 201, { user });
  });

  handleLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { _id, role, refreshToken } = await this.login({ email, password });
    const accessToken = signCookie(res, { _id, role });
    response(res, 200, {}, { accessToken, refreshToken });
  });

  handleRefreshToken = asyncHandler(async (req: AuthRequest, res) => {
    const { _id } = req.auth;
    const token = req.temp?.refreshToken;
    const { role, refreshToken } = await this.refreshToken(_id, token);
    const accessToken = signCookie(res, { _id, role });
    response(res, 200, {}, { accessToken, refreshToken });
  });
}

export default AuthController;
