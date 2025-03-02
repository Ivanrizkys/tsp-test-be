import db from "#/common/config/database/connection.ts";
import { Router } from "express";

import { AuthController } from "./auth-controller.ts";
import { AuthRepository } from "./auth-repository.ts";
import { AuthService } from "./auth-service.ts";

const authRepository = new AuthRepository(db);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

export const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/operator-register", authController.operatorRegister);
