import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { NextFunction, Request, Response } from "express";

export const validateDtoMiddleware =
  (dtoClass: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(dtoClass, req.body);
      await validateOrReject(dto);
      req.body = dto;
      next();
    } catch (errors) {
      next(errors);
    }
  };
