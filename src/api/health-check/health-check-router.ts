import db from "#/common/config/database/connection.js";
import { usersTable } from "#/common/config/database/schema.js";
import { sendResponseSuccess } from "#/common/utils/send-response.js";
import { NextFunction, Request, Response, Router } from "express";

export const healthCheckRouter = Router();

healthCheckRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.select().from(usersTable).limit(1);
    sendResponseSuccess(res, 200, null, {
      message: "Server is running",
    });
  } catch (error) {
    next(error);
  }
});
