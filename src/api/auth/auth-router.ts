import db from "#/common/config/database/connection.js";
import { Router } from "express";

import { AuthController } from "./auth-controller.js";
import { AuthRepository } from "./auth-repository.js";
import { AuthService } from "./auth-service.js";

const authRepository = new AuthRepository(db);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

export const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/operator-register", authController.operatorRegister);
