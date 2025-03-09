import { authRouter } from "#/api/auth/auth-router.js";
import { healthCheckRouter } from "#/api/health-check/health-check-router.js";
import { userRouter } from "#/api/user/user-router.js";
import { workOrderRouter } from "#/api/work-order/work-order-router.js";
import { ENV } from "#/common/config/env.js";
import { errorMiddleware } from "#/common/middleware/error-middleware.js";
import cors from "cors";
import express from "express";

const app = express();
const port = ENV.PORT ?? "9000";

app.use(cors());
app.use(express.json());

app.use("/health-check", healthCheckRouter);
app.use("/auth", authRouter);
app.use("/work-orders", workOrderRouter);
app.use("/users", userRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
