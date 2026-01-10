import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

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
}
