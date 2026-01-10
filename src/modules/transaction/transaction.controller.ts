import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { plainToInstance } from "class-transformer";
import { TopupDTO } from "./dto/topup.dto";
import { validate, validateOrReject } from "class-validator";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  getBalance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const email = req.user!.email;
      const balance = await this.transactionService.getBalance(email);
      res.status(200).json({
        status: 0,
        message: "Get balance berhasil",
        data: balance,
      });
    } catch (error) {
      next(error);
    }
  };

  topup = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const email = req.user!.email;
      const dto: TopupDTO = req.body
      const topupResult = await this.transactionService.topup(
        dto,
        email
      );
      res.status(200).json({
        status: 0,
        message: "Top Up Balance berhasil",
        data: topupResult,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
