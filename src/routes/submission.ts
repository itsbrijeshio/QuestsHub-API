import { Router } from "express";
import { SubmissionController } from "../controllers";
import { validateRequest } from "../middlewares";
import {
  submissionSchema,
  updateSubmissionSchema,
} from "../schemas/submission";

const controller = new SubmissionController();

const isValidId = validateRequest.isValidId(
  "submissionId",
  "params",
  "Submission"
);

const router = Router();

router.post("/", validateRequest(submissionSchema), controller.handleAddByUser);
router.get("/", controller.handleGetAllByUser);
router.get("/:submissionId", isValidId, controller.handleGetByUser);
router.put(
  "/:submissionId",
  isValidId,
  validateRequest(updateSubmissionSchema),
  controller.handleUpdateByUser
);
router.delete("/:submissionId", isValidId, controller.handleDeleteByUser);

export default router;
