import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new ApiError("Token tidak valid atau kadaluwarsa", 401, 108));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new ApiError("Token tidak valid atau kadaluwarsa", 401, 108));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as {
      id: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

