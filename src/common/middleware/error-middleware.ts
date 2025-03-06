import { ResponseError } from "#/common/error/response-error.js";
import { sendResponseFailure } from "#/common/utils/send-response.js";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    sendResponseFailure(res, 400, `Validation Error : ${JSON.stringify(error.flatten().fieldErrors)}`);
  } else if (error instanceof ResponseError) {
    sendResponseFailure(res, error.status, error.message);
  } else {
    sendResponseFailure(res, 500, error.message);
  }
};
