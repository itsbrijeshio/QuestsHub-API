import { Router } from "express";
import {
  QuestController,
  SubmissionController,
  UserController,
} from "../controllers";
import { validateRequest } from "../middlewares";
import {
  createQuestSchema,
  updateQuestSchema,
  questQuery as querySchema,
} from "../schemas/quest";
import { submissionReviewSchema } from "../schemas/submission";

const questController = new QuestController();
const submissionController = new SubmissionController();
const userController = new UserController();

const router = Router();

const isValidId = (id: string, name: string) =>
  validateRequest.isValidId(id, "params", name);

router.post(
  "/quests",
  validateRequest(createQuestSchema),
  questController.handleCreateByAdmin
);
router.put(
  "/quests/:questId",
  isValidId("questId", "Quest"),
  validateRequest(updateQuestSchema),
  questController.handleUpdateByAdmin
);
router.delete(
  "/quests/:questId",
  isValidId("questId", "Quest"),
  questController.handleDeleteByAdmin
);

router.get(
  "/submissions",
  validateRequest(querySchema, "query"),
  submissionController.handleGetAllByAdmin
);
router.put(
  "/submissions/:submissionId/review",
  isValidId("submissionId", "Submission"),
  validateRequest(submissionReviewSchema),
  submissionController.handleReviewByAdmin
);
router.delete(
  "/submissions/:submissionId",
  isValidId("submissionId", "Submission"),
  questController.handleDeleteByAdmin
);

router.get(
  "/xp/:userId",
  isValidId("userId", "User"),
  userController.handleGetXpByAdmin
);

router.get("/users", questController.handleGetAllByUser);

export default router;
