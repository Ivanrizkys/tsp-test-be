import { sendResponseSuccess } from "#/common/utils/send-response.ts";
import { Request, Response, Router } from "express";

export const healthCheckRouter = Router();

healthCheckRouter.get("/", (req: Request, res: Response) => {
  sendResponseSuccess(res, null, {
    message: "Server is running",
  });
});
