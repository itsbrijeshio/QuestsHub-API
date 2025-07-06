import zod from "zod";

const questId = zod
  .string({
    required_error: "Quest ID is required",
    invalid_type_error: "Quest ID must be a string",
  })
  .length(24, { message: "Quest ID must be a valid UUID" });

const repoUrl = zod
  .string({
    required_error: "Repo URL is required",
    invalid_type_error: "Repo URL must be a string",
  })
  .url({ message: "Repo URL must be a valid URL" });

const comment = zod
  .string({
    required_error: "Comment is required",
    invalid_type_error: "Comment must be a string",
  })
  .min(5, { message: "Comment must be at least 5 characters long" })
  .max(500, { message: "Comment must be at most 500 characters long" });

const score = zod.number({}).min(1).max(150);

const submissionSchema = zod
  .object({
    questId,
    repoUrl,
    comment,
  })
  .strict();

const updateSubmissionSchema = zod
  .object({
    questId: questId.optional(),
    repoUrl: repoUrl.optional(),
    comment: comment.optional(),
  })
  .strict();

const submissionReviewSchema = zod
  .object({
    score,
  })
  .strict();

export { submissionSchema, submissionReviewSchema, updateSubmissionSchema };
