import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import questRouter from "./quest";
import submissionRouter from "./submission";
import adminRouter from "./admin";
import { authGuard } from "../middlewares";

const router = Router();

const roleGuard = authGuard.roleGuard(["admin"]);

router.use("/auth", authRouter);
router.use("/quests", questRouter);
router.use("/user", authGuard, userRouter);
router.use("/submissions", authGuard, submissionRouter);
router.use("/admin", authGuard, roleGuard, adminRouter);

export default router;
