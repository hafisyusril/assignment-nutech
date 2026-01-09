import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let httpStatus = 500;
  let code = 999;
  let message = "Internal Server Error";

  // JWT Error
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    httpStatus = 401;
    code = 108;
    message = "Token tidak valid atau kadaluwarsa";
  }
  // Custom API Error
  if (err instanceof ApiError) {
    httpStatus = err.status;
    code = err.status;
    message = err.message;
  }

  res.status(httpStatus).json({
    status: code,
    message,
    data: null,
  });
};
