import zod from "zod";

const title = zod
  .string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  })
  .min(5, { message: "Title must be at least 5 characters long" })
  .max(50, { message: "Title must be at most 50 characters long" });

const description = zod
  .string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  })
  .min(20, { message: "Description must be at least 20 characters long" })
  .max(500, { message: "Description must be at most 500 characters long" });

const skillCategory = zod
  .string({
    required_error: "Skill category is required",
    invalid_type_error: "Skill category must be a string",
  })
  .min(3, { message: "Skill category must be at least 3 characters long" })
  .max(30, { message: "Skill category must be at most 30 characters long" });

const tags = zod
  .array(
    zod
      .string({
        required_error: "Tag is required",
        invalid_type_error: "Tag must be a string",
      })
      .min(2, { message: "Tag must be at least 2 characters long" })
      .max(30, { message: "Tag must be at most 30 characters long" })
  )
  .min(1, { message: "At least one tag is required" })
  .max(10, { message: "Maximum of 10 tags are allowed" });

const difficulty = zod.enum(["easy", "medium", "hard"], {
  required_error: "Difficulty is required",
  invalid_type_error: "Difficulty must be a string",
});

const createQuestSchema = zod
  .object({
    title,
    description,
    skillCategory,
    tags,
    difficulty,
  })
  .strict();

const updateQuestSchema = zod
  .object({
    title: title.optional(),
    description: description.optional(),
    skillCategory: skillCategory.optional(),
    tags: tags.optional(),
    difficulty: difficulty.optional(),
  })
  .strict();

const questQuery = zod
  .object({
    query: zod.string().optional(),
    page: zod.number().min(1).optional(),
    limit: zod.number().min(1).optional(),
  })
  .strict();

export { createQuestSchema, updateQuestSchema, questQuery };
