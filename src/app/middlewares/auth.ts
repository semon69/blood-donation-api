import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import config from "../config";
import httpStatus from "http-status";
import { jwtHelpers } from "../helpers/jwtHelpers";
import AppError from "../errors/AppError";

export const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      // console.log(token);
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
      }
      const decodedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      console.log(decodedUser);

      req.user = decodedUser;

      if (roles.length && !roles.includes(decodedUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
