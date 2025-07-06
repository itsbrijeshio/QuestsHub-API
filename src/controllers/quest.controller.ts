import { asyncHandler } from "../middlewares";
import { response } from "../utils";
import { QuestService } from "../services";
import { AuthRequest } from "../types";

class QuestController extends QuestService {
  constructor() {
    super();
  }

  handleCreateByAdmin = asyncHandler(async (req: AuthRequest, res) => {
    const { _id } = req.auth;
    const quest = await this.createByAdmin(_id, req.body);
    response(res, 201, { quest });
  });

  handleGetByUser = asyncHandler(async (req: AuthRequest, res) => {
    const { questId } = req.params;
    const quest = await this.getByUser(questId);
    response(res, 200, { quest });
  });

  handleGetAllByUser = asyncHandler(async (req: AuthRequest, res) => {
    const quests = await this.getAllByUser(req.query);
    response(res, 200, { quests });
  });

  handleUpdateByAdmin = asyncHandler(async (req: AuthRequest, res) => {
    const { questId } = req.params;
    const quest = await this.updateByAdmin(questId, req.body);
    response(res, 200, { quest });
  });

  handleDeleteByAdmin = asyncHandler(async (req: AuthRequest, res) => {
    const { questId } = req.params;
    const quest = await this.deleteByAdmin(questId);
    response(res, 200, { quest });
  });
}

export default QuestController;
