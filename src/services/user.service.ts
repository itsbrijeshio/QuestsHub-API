import argon2 from "argon2";
import { submissionModel, userModel } from "../models";
import { ApiError } from "../utils";
import generateToken from "../utils/generateToken";
import { envs } from "../config";

type UserProps = {
  email: string;
  password: string;
};

interface UserRegisterProps extends UserProps {
  name: string;
}

class UserService {
  constructor() {}

  private sanitize(user: any): any {
    const { password, __v, updatedAt, refreshToken, ...rest } = user?.toJSON();
    return rest;
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  private async verifyPassword(
    hashedPass: string,
    password: string
  ): Promise<boolean> {
    return await argon2.verify(hashedPass, password);
  }

  private isEmailUnique = async (email: string): Promise<boolean> => {
    const user = await userModel.findOne({ email });
    return !user;
  };

  private findUser = async (userId: string): Promise<any> => {
    const findUser = await userModel.findById(userId);
    if (!findUser) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "User not found",
        error: { type: "NotFoundError" },
      });
    }
    return findUser;
  };

  register = async (user: UserRegisterProps): Promise<any> => {
    const isEmailUnique = await this.isEmailUnique(user.email);
    if (!isEmailUnique) {
      throw new ApiError({
        status: "fail",
        code: 409,
        message: "Email already exists",
        error: { type: "ConflictError" },
      });
    }

    user.password = await this.hashPassword(user.password);
    const createdUser = await userModel.create(user);
    return this.sanitize(createdUser);
  };

  login = async (
    user: UserProps
  ): Promise<{ _id: string; role: string; refreshToken: string }> => {
    const findUser = await userModel.findOne({ email: user.email });
    if (!findUser) {
      throw new ApiError({
        status: "fail",
        code: 400,
        message: "User not found",
        error: { type: "NotFoundError" },
      });
    }

    const isPasswordValid = await this.verifyPassword(
      findUser.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError({
        status: "fail",
        code: 400,
        message: "Invalid credentials",
        error: { type: "AuthenticationError" },
      });
    }

    const refreshToken = generateToken(
      "_id",
      findUser._id.toString(),
      envs.JWT_REFRESH_SECRET,
      envs.JWT_REFRESH_EXPIRES_IN
    );

    findUser.refreshToken = refreshToken;
    await findUser.save();

    return {
      _id: findUser._id?.toString(),
      role: findUser?.role,
      refreshToken,
    };
  };

  getMe = async (userId: string): Promise<any> => {
    const findUser = await this.findUser(userId);
    return this.sanitize(findUser);
  };

  refreshToken = async (
    userId: string,
    token: string
  ): Promise<{ _id: string; role: string; refreshToken: string }> => {
    const findUser = await userModel.findOne({
      refreshToken: token,
      _id: userId,
    });

    if (!findUser) {
      throw new ApiError({
        status: "fail",
        code: 401,
        message: "Invalid or expired refresh token",
        error: { type: "AuthenticationError" },
      });
    }

    const refreshToken = generateToken(
      "_id",
      findUser._id.toString(),
      envs.JWT_REFRESH_SECRET,
      envs.JWT_REFRESH_EXPIRES_IN
    );

    findUser.refreshToken = refreshToken;
    await findUser.save();

    return {
      _id: findUser._id?.toString(),
      role: findUser?.role,
      refreshToken,
    };
  };

  getAllUsers = async ({ query = "", page = 1, limit = 30 }): Promise<any> => {
    const where: any = { $or: [] };

    if (query) {
      where.$or.push(
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      );
    }
    const skip = (page - 1) * limit;
    const users = await userModel.find(where).skip(skip).limit(limit);
    return users.map((user) => this.sanitize(user));
  };

  getXpLog = async (userId: string) => {
    const findUser = await this.findUser(userId);
    const findSubmission = await submissionModel
      .find({ submittedBy: userId, score: { $gt: 0 } })
      .populate("quest", "title skillCategory")
      .lean();

    if (!findSubmission) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "Submission not found",
        error: { type: "NotFoundError" },
      });
    }

    const user = {
      name: findUser?.name,
      email: findUser?.email,
    };
    const totalXp = findUser?.xp;

    const bySkills = findUser?.skills?.map((s: any) => {
      return {
        xp: s.xp,
        category: s.category,
      };
    });
    const history = findSubmission?.map((s) => {
      if (!s.score) return;
      const { _id = "", ...quest }: any = s.quest || { _id: "" };
      return {
        xp: s.score,
        date: s.createdAt,
        ...quest,
      };
    });
    return { user, totalXp, bySkills, history };
  };
}

export default UserService;
