import db from "#/common/config/database/connection.ts";
import { usersTable } from "#/common/config/database/schema.ts";
import { sendResponseSuccess } from "#/common/utils/send-response.ts";
import { NextFunction, Request, Response, Router } from "express";

export const healthCheckRouter = Router();

healthCheckRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.select().from(usersTable).limit(1);
    sendResponseSuccess(res, null, {
      message: "Server is running",
    });
  } catch (error) {
    next(error);
  }
});
