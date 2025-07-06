import { config } from "dotenv";

const getEnv = () => {
  if (process.env.NODE_ENV === "production") {
    return ".env";
  } else if (process.env.NODE_ENV === "test") {
    return ".env.test";
  } else {
    return ".env.dev";
  }
};

config({
  path: getEnv(),
});

const envs = {
  NODE_ENV: process.env.NODE_ENV as string,
  MONGODB_URI: process.env.MONGODB_URI as string,
  PORT: process.env.PORT as string,
  SESSION_SECRET: process.env.SESSION_SECRET as string,
  FRONTEND_URI: process.env.FRONTEND_URI,
  // Token
  VERIFY_TOKEN_EXPIRES_IN: process.env.VERIFY_TOKEN_EXPIRES_IN as string,
  RESET_TOKEN_EXPIRES_IN: process.env.RESET_TOKEN_EXPIRES_IN as string,
  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
};

export default envs;
