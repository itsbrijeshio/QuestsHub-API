import { submissionModel, userModel } from "../models";
import { ApiError } from "../utils";
import QuestService from "./quest.service";

class SubmissionService {
  private questService: QuestService;

  constructor() {
    this.questService = new QuestService();
  }

  private sanitize(submission: any) {
    const { __v, ...rest } = submission?.toJSON();
    return rest;
  }

  addByUser = async (userId: string, submission: any) => {
    await this.questService.findQuestById(submission.questId);
    const isSubmissionUnique = await submissionModel.findOne({
      submittedBy: userId,
      quest: submission.questId,
    });
    if (isSubmissionUnique) {
      throw new ApiError({
        status: "fail",
        code: 400,
        message: "You have already submitted for this quest",
        error: { type: "ConflictError" },
      });
    }
    submission.submittedBy = userId;
    submission.quest = submission.questId;
    const newSubmission = await submissionModel.create(submission);
    return this.sanitize(newSubmission);
  };

  getByUser = async (submissionId: string) => {
    const findSubmission = await submissionModel.findById(submissionId);
    if (!findSubmission) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "Submission not found",
        error: { type: "NotFoundError" },
      });
    }
    return this.sanitize(findSubmission);
  };

  getByAdmin = async (submissionId: string) => {
    const findSubmission = await submissionModel.findById(submissionId);
    if (!findSubmission) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "Submission not found",
        error: { type: "NotFoundError" },
      });
    }
    return this.sanitize(findSubmission);
  };

  getAllByUser = async (userId: string, { page = 1, limit = 30 }) => {
    const skip = (page - 1) * limit;
    const submissions = await submissionModel
      .find({ submittedBy: userId })
      .select("-submittedBy")
      .populate("quest", "title description")
      .skip(skip)
      .limit(limit);
    return submissions.map((submission) => this.sanitize(submission));
  };

  getAllByAdmin = async ({ page = 1, limit = 30 }) => {
    const skip = (page - 1) * limit;
    const submissions = await submissionModel
      .find()
      .populate("submittedBy", "name email")
      .populate("quest", "title description")
      .skip(skip)
      .limit(limit);
    return submissions.map((submission) => this.sanitize(submission));
  };

  updateByUser = async (
    userId: string,
    submissionId: string,
    submission: any
  ) => {
    const findSubmission = await submissionModel.findById(submissionId);
    if (!findSubmission || findSubmission.submittedBy?.toString() !== userId) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "Submission not found",
        error: { type: "NotFoundError" },
      });
    }
    return this.sanitize(
      await submissionModel.findByIdAndUpdate(submissionId, submission, {
        new: true,
      })
    );
  };

  reviewByAdmin = async (submissionId: string, submission: any) => {
    const findSubmission = await submissionModel
      .findById(submissionId)
      .populate("quest", "skillCategory");
    if (!findSubmission) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "Submission not found",
        error: { type: "NotFoundError" },
      });
    }
    const findUser = await userModel.findById(findSubmission.submittedBy);
    if (!findUser) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "User not found",
        error: { type: "NotFoundError" },
      });
    }
    const quest: any = findSubmission.quest?.toJSON();
    const skillCategory = quest?.skillCategory;
    const isSkillExist = findUser.skills.find(
      (skill: any) => skill.category === skillCategory
    );
    
    if (findSubmission.score) {
      findUser.xp = findUser.xp - findSubmission.score + submission.score;
    } else {
      findUser.xp = findUser.xp + submission.score;
    }

    if (!isSkillExist) {
      findUser.skills.push({
        category: skillCategory,
        xp: submission.score,
      });
    } else {
      findUser.skills.map((skill: any) => {
        if (skill.category === skillCategory) {
          if (findSubmission.score) {
            skill.xp = skill.xp - findSubmission.score + submission.score;
          } else {
            skill.xp = skill.xp + submission.score;
          }
        }
      });
    }
    await findUser.save();
    return this.sanitize(
      await submissionModel.findByIdAndUpdate(submissionId, submission, {
        new: true,
      })
    );
  };

  deleteByUser = async (userId: string, submissionId: string) => {
    const findSubmission = await submissionModel.findById(submissionId);
    if (!findSubmission || findSubmission.submittedBy?.toString() !== userId) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "Submission not found",
        error: { type: "NotFoundError" },
      });
    }
    return this.sanitize(await submissionModel.findByIdAndDelete(submissionId));
  };

  deleteByAdmin = async (submissionId: string) => {
    const findSubmission = await submissionModel.findById(submissionId);
    if (!findSubmission) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "Submission not found",
        error: { type: "NotFoundError" },
      });
    }
    return this.sanitize(await submissionModel.findByIdAndDelete(submissionId));
  };
}

export default SubmissionService;
