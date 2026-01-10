import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateDtoMiddleware } from "../../middlewares/validate.dto.middleware";
import { TopupDTO } from "./dto/topup.dto";
import { TransactionDTO } from "./dto/transaction.dto";

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/balance",
      authMiddleware,
      this.transactionController.getBalance
    );
    this.router.get(
      "/transaction/history",
      authMiddleware,
      this.transactionController.transactionHistory
    );
    this.router.post(
      "/topup",
      authMiddleware,
      validateDtoMiddleware(TopupDTO),
      this.transactionController.topup
    );
    this.router.post(
      "/transaction",
      authMiddleware,
      validateDtoMiddleware(TransactionDTO),
      this.transactionController.transaction
    );
  }

  getRouter() {
    return this.router;
  }
}
