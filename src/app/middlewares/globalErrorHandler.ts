import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    success: false,
    message: err?.message,
    errorDetails: err,
  });
  next();
};
export default globalErrorHandler;