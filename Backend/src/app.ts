import express from "express";
import cors from "cors";
import routes from "./routes";
import cookieParser from "cookie-parser";
import path from "path";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// uploads folder ko public banao
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", routes);

export default app;
