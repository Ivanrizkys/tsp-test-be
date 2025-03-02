import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { ResponseError } from "../error/response-error.ts";
import { DecodedToken, UserRequest } from "../model/index.ts";

export const authenticate = (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.get("Authorization");
    if (!token) {
      throw new ResponseError(403, "Token is required");
    }
    const splitToken = token.split(" ");
    if (splitToken.length !== 2) {
      throw new ResponseError(403, "Invalid token format");
    }
    if (splitToken[0] !== "Bearer") {
      throw new ResponseError(403, "Token must be Bearer type");
    }
    const decoded = jwt.verify(splitToken[1], process.env.JWT_SECRET!);
    req.user = decoded as DecodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (permissions: string[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    if (permissions.length === 0) {
      next();
      return;
    }
    const userPermissions = req.user.permissions;
    const hasPermission = permissions.some((permission) => userPermissions.includes(permission));
    if (!hasPermission) {
      throw new ResponseError(403, "You are not authorized to access this resource");
    }
    next();
  };
};
