import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { envs } from "./config";
import { rateLimiter } from "./middlewares";

const app = express();

// Middlewares
app.use(
  cors({
    origin: envs.FRONTEND_URI || "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter());

app.get("/", (req, res) => {
  res.send(
    "Welcome to QuestsHub! Docs: https://github.com/itsbrijeshio/QuestsHub-API.git"
  );
});

app.use("/api", routes);

export default app;
