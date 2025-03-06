import { authRouter } from "#/api/auth/auth-router.js";
import { healthCheckRouter } from "#/api/health-check/health-check-router.js";
import { workOrderRouter } from "#/api/work-order/work-order-router.js";
import { errorMiddleware } from "#/common/middleware/error-middleware.js";
import express from "express";

const app = express();
const port = process.env.PORT ?? "9000";

app.use(express.json());

app.use("/health-check", healthCheckRouter);
app.use("/auth", authRouter);
app.use("/work-orders", workOrderRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
