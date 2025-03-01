import { ResponseError } from "#/common/error/response-error.ts";
import { Request, Response } from "express";
import { ZodError } from "zod";

export const errorMiddleware = async (error: Error, req: Request, res: Response) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      errors: `Validation Error : ${JSON.stringify(error)}`,
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      errors: error.message,
    });
  } else {
    res.status(500).json({
      errors: error.message,
    });
  }
};
