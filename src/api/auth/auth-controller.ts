import { sendResponseSuccess } from "#/common/utils/send-response.js";
import { NextFunction, Request, RequestHandler, Response } from "express";

import { AuthService } from "./auth-service.js";

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const userInformation = await this.authService.login(data);
      sendResponseSuccess(res, 200, userInformation, {
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
      sendResponseSuccess(res, 201, operator, {
        message: "Operator created successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
