import db from "#/common/config/database/connection.ts";
import { usersTable } from "#/common/config/database/schema.ts";
import { sendResponseSuccess } from "#/common/utils/send-response.ts";
import { Request, Response, Router } from "express";

export const healthCheckRouter = Router();

healthCheckRouter.get("/", async (req: Request, res: Response) => {
  await db.select().from(usersTable).limit(1);
  sendResponseSuccess(res, null, {
    message: "Server is running",
  });
});
