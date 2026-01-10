import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

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
  }

  getRouter() {
    return this.router;
  }
}
