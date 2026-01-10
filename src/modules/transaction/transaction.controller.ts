import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { plainToInstance } from "class-transformer";
import { TopupDTO } from "./dto/topup.dto";
import { validate, validateOrReject } from "class-validator";
import { TransactionDTO } from "./dto/transaction.dto";

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
      const dto: TopupDTO = req.body;
      const topupResult = await this.transactionService.topup(dto, email);
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

  transaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const email = req.user!.email;
      const dto: TransactionDTO = req.body;
      const transactionResult = await this.transactionService.transaction(
        dto,
        email
      );
      res.status(200).json({
        status: 0,
        message: "Transaksi berhasil",
        data: transactionResult,
      });
    } catch (error) {
      next(error);
    }
  };

  transactionHistory = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const email = req.user!.email;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const offset = req.query.offset ? Number(req.query.offset) : undefined;

      const transactionHistory =
        await this.transactionService.transactionHistory(email, limit, offset);
      res.status(200).json({
        status: 0,
        message: "Get History Berhasil",
        data: transactionHistory,
      });
    } catch (error) {
      next(error);
    }
  };
}
