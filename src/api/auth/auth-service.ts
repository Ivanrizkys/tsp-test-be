import { ResponseError } from "#/common/error/response-error.js";
import { DecodedToken } from "#/common/model/index.js";
import { Validate } from "#/common/utils/validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./auth-model.js";
import { AuthRepository } from "./auth-repository.js";
import { LoginRequestSchema, RegisterRequestSchema } from "./auth-validation.js";

export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const validatedRequest = Validate(LoginRequestSchema, request);
    const user = await this.authRepository.getUserByEmail(validatedRequest.email);
    if (!user) {
      throw new ResponseError(400, "Invalid email or password");
    }
    const res = await bcrypt.compare(validatedRequest.password, user.password);
    if (!res) {
      throw new ResponseError(400, "Invalid email or password");
    }
    const userRole = await this.authRepository.getUserRoleById(user.roleId);
    if (!userRole) {
      throw new ResponseError(400, "Invalid email or password");
    }
    const claims: DecodedToken = {
      email: user.email,
      id: user.id,
      name: user.name,
      permissions: userRole.permissions,
      role: userRole.id,
    };
    const token = jwt.sign(claims, process.env.JWT_SECRET!, { expiresIn: "6h" });
    return {
      token,
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
        role: userRole.id,
      },
    };
  }

  async operatorRegister(request: RegisterRequest): Promise<RegisterResponse> {
    const validatedRequest = Validate(RegisterRequestSchema, request);
    const user = await this.authRepository.countUserByEmail(validatedRequest.email);
    if (user > 0) {
      throw new ResponseError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(validatedRequest.password, 10);

    const newOperator = await this.authRepository.createUser({
      email: validatedRequest.email,
      name: validatedRequest.name,
      password: hashedPassword,
      roleId: 2,
    });
    return {
      user: {
        email: newOperator.email,
        id: newOperator.id,
        name: newOperator.name,
      },
    };
  }
}
