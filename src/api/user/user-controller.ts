import { sendResponseSuccess } from "#/common/utils/send-response.js";
import { NextFunction, Request, RequestHandler, Response } from "express";

import { UserService } from "./user-service.js";

export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public getOperators: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const operators = await this.userService.getOperators();
      sendResponseSuccess(res, 200, operators, {
        message: "Get operators successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
