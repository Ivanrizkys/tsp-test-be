import { authRouter } from "#/api/auth/auth-router.ts";
import { healthCheckRouter } from "#/api/health-check/health-check-router.ts";
import { errorMiddleware } from "#/common/middleware/error-middleware.ts";
import express from "express";

const app = express();
const port = process.env.PORT ?? "9000";

app.use(express.json());

app.use("/health-check", healthCheckRouter);
app.use("/auth", authRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
