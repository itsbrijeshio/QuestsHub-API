import { questModel } from "../models";
import { ApiError } from "../utils";

type Quest = {
  title: string;
  description: string;
  skillCategory: string;
  tags: string[];
  difficulty: string;
  createdBy?: any;
};

type QuestQuery = {
  query: string;
  page: number;
  limit: number;
};

interface QuestResponse extends Quest {
  createdAt?: string;
}

class QuestService {
  private sanitize(quest: any): QuestResponse {
    const { __v, ...rest } = quest?.toJSON ? quest.toJSON() : quest;
    return rest;
  }

  findQuestById = async (questId: string): Promise<QuestResponse> => {
    const findQuest = await questModel.findById(questId);
    if (!findQuest) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "Quest not found",
        error: { type: "NotFoundError" },
      });
    }
    return this.sanitize(findQuest);
  };

  createByAdmin = async (
    userId: string,
    quest: Quest
  ): Promise<QuestResponse> => {
    quest.createdBy = userId;
    const newQuest = await questModel.create(quest);
    return this.sanitize(newQuest);
  };

  getByUser = async (questId: string): Promise<QuestResponse> => {
    const findQuest = await this.findQuestById(questId);
    return this.sanitize(findQuest);
  };

  getAllByUser = async ({
    query = "",
    page = 1,
    limit = 30,
  }: QuestQuery): Promise<QuestResponse[]> => {
    const where: {
      $or: any;
    } = { $or: [] };

    if (query) {
      where.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const allQuests = await questModel
      .find(where)
      .skip(skip)
      .limit(limit)
      ?.populate("createdBy", "name");
    return allQuests.map((quest) => this.sanitize(quest));
  };

  updateByAdmin = async (
    questId: string,
    quest: Quest
  ): Promise<QuestResponse> => {
    const updatedQuest = await questModel.findByIdAndUpdate(questId, quest, {
      new: true,
    });
    if (!updatedQuest) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "Quest not found",
        error: { type: "NotFoundError" },
      });
    }
    return this.sanitize(updatedQuest);
  };

  deleteByAdmin = async (questId: string): Promise<QuestResponse> => {
    const deletedQuest = await questModel.findByIdAndDelete(questId);
    if (!deletedQuest) {
      throw new ApiError({
        status: "fail",
        code: 404,
        message: "Quest not found",
        error: { type: "NotFoundError" },
      });
    }
    return this.sanitize(deletedQuest);
  };
}

export default QuestService;
