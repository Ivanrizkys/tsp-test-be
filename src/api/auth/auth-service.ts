import { ResponseError } from "#/common/error/response-error.ts";
import { DecodedToken } from "#/common/model/index.ts";
import { Validate } from "#/common/utils/validation.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./auth-model.ts";
import { AuthRepository } from "./auth-repository.ts";
import { LoginRequestSchema, RegisterRequestSchema } from "./auth-validation.ts";

export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const validatedRequest = Validate(LoginRequestSchema, request);
    const user = await this.authRepository.getUserByEmail(validatedRequest.email);
    if (!user) {
      throw new ResponseError(401, "Invalid email or password");
    }
    const res = await bcrypt.compare(validatedRequest.password, user.password);
    if (!res) {
      throw new ResponseError(401, "Invalid email or password");
    }
    const userRole = await this.authRepository.getUserRoleById(user.roleId);
    const claims: DecodedToken = {
      email: user.email,
      id: user.id,
      name: user.name,
      permissions: userRole.permissions,
    };
    const token = jwt.sign(claims, process.env.JWT_SECRET!, { expiresIn: "6h" });
    return {
      token,
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
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
    const userRole = await this.authRepository.getUserRoleById(1);

    const newOperator = await this.authRepository.createUser({
      email: validatedRequest.email,
      name: validatedRequest.name,
      password: hashedPassword,
      roleId: userRole.id,
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
