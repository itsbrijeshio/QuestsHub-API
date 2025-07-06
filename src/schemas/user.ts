import zod from "zod";

const name = zod
  .string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  })
  .min(3, { message: "Name must be at least 3 characters long" })
  .max(30, { message: "Name must be at most 30 characters long" });

const email = zod
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .email({ message: "Email must be a valid email address" });

const password = zod
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(30, { message: "Password must be at most 30 characters long" });

const registerSchema = zod
  .object({
    name,
    email,
    password,
  })
  .strict();

const loginSchema = zod
  .object({
    email,
    password,
  })
  .strict();

export { registerSchema, loginSchema };
