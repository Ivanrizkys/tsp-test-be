import { sendResponseSuccess } from "#/common/utils/send-response.ts";
import { NextFunction, Request, RequestHandler, Response } from "express";

import { AuthService } from "./auth-service.ts";

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const userInformation = await this.authService.login(data);
      sendResponseSuccess(res, userInformation, {
        message: "Login successful",
      });
    } catch (error) {
      next(error);
    }
  };

  public operatorRegister: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const operator = await this.authService.operatorRegister(data);
      sendResponseSuccess(res, operator, {
        message: "Operator created successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
