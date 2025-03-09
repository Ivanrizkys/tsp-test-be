import db from "#/common/config/database/connection.js";
import { authenticate } from "#/common/middleware/auth-middleware.js";
import { Router } from "express";

import { UserController } from "./user-controller.js";
import { UserRepository } from "./user-repository.js";
import { UserService } from "./user-service.js";

const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export const userRouter = Router();

userRouter.get("/operators", authenticate, userController.getOperators);
