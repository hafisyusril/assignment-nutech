import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { ValidationError } from "class-validator";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let httpStatus = 500;
  let code = 1;
  let message = "Internal Server Error";

  // DTO Validation Error 
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    const messages = err
      .map(e => Object.values(e.constraints || {}).join(", "))
      .join("; ");
    return res.status(400).json({
      status: 102, 
      message: messages,
      data: null
    });
  }

  // JWT Error
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    httpStatus = 401;
    code = 108;
    message = "Token tidak valid atau kadaluwarsa";
  }
  // Custom API Error
  if (err instanceof ApiError) {
    httpStatus = err.httpStatus;
    code = err.businessStatus;
    message = err.message;
  }

  res.status(httpStatus).json({
    status: code,
    message,
    data: null,
  });
};
