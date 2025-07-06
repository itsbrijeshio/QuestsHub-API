import { Router } from "express";
import { AuthController } from "../controllers";
import { authRefreshToken, validateRequest } from "../middlewares";
import { registerSchema, loginSchema } from "../schemas/user";

const controller = new AuthController();

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  controller.handleRegister
);
router.post("/login", validateRequest(loginSchema), controller.handleLogin);
router.get("/refresh", authRefreshToken, controller.handleRefreshToken);

export default router;
