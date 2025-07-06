import { asyncHandler } from "../middlewares";
import { response } from "../utils";
import { SubmissionService } from "../services";
import { AuthRequest } from "../types";

class SubmissionController extends SubmissionService {
  constructor() {
    super();
  }

  handleAddByUser = asyncHandler(async (req: AuthRequest, res) => {
    const { _id } = req.auth;
    const submission = await this.addByUser(_id, req.body);
    response(res, 201, { submission });
  });

  handleGetByUser = asyncHandler(async (req, res) => {
    const { submissionId } = req.params;
    const submission = await this.getByUser(submissionId);
    response(res, 200, { submission });
  });

  handleGetAllByUser = asyncHandler(async (req: AuthRequest, res) => {
    const { _id } = req.auth;
    const submissions = await this.getAllByUser(_id, req.query);
    response(res, 200, { submissions });
  });

  handleUpdateByUser = asyncHandler(async (req: AuthRequest, res) => {
    const { _id } = req.auth;
    const { submissionId } = req.params;
    const submission = req.body;
    const updatedSubmission = await this.updateByUser(
      _id,
      submissionId,
      submission
    );
    response(res, 200, { updatedSubmission });
  });

  handleDeleteByUser = asyncHandler(async (req: AuthRequest, res) => {
    const { _id } = req.auth;
    const { submissionId } = req.params;
    const submission = await this.deleteByUser(_id, submissionId);
    response(res, 200, { submission });
  });

  handleGetByAdmin = asyncHandler(async (req: AuthRequest, res) => {
    const { submissionId } = req.params;
    const submission = await this.getByAdmin(submissionId);
    response(res, 200, { submission });
  });

  handleGetAllByAdmin = asyncHandler(async (req: AuthRequest, res) => {
    const submissions = await this.getAllByAdmin(req.query);
    response(res, 200, { submissions });
  });

  handleReviewByAdmin = asyncHandler(async (req: AuthRequest, res) => {
    const { submissionId } = req.params;
    const submission = await this.reviewByAdmin(submissionId, req.body);
    response(res, 200, { submission });
  });

  handleDeleteByAdmin = asyncHandler(async (req: AuthRequest, res) => {
    const { submissionId } = req.params;
    const submission = await this.deleteByAdmin(submissionId);
    response(res, 200, { submission });
  });
}

export default SubmissionController;
