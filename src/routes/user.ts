import { Router } from "express";
import { UserController } from "../controllers";

const controller = new UserController();

const router = Router();

router.get("/me", controller.handleGetMe);
router.get("/xp", controller.handleGetXpByUser);

export default router;
