import { Router } from "express";
import { QuestController } from "../controllers";
import { validateRequest } from "../middlewares";
import { questQuery } from "../schemas/quest";

const controller = new QuestController();

const router = Router();

const isValidId = validateRequest.isValidId("questId", "params", "Quest");

router.get("/", validateRequest(questQuery, "query"), controller.handleGetAllByUser);
router.get("/:questId", isValidId, controller.handleGetByUser);

export default router;
