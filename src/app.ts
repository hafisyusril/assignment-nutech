import express, { Express, Request, Response, urlencoded } from "express";
import { MembershipRouter } from "./modules/membership/membership.router";
import { errorMiddleware } from "./middlewares/error.middleware";

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }
  private configure() {
    this.app.use(express.json());
    this.app.use(urlencoded({ extended: true }));
  }

  private routes(): void {
    const membershipRouter = new MembershipRouter();

    this.app.use("/api/auth", membershipRouter.getRouter());
  }

  private handleError(): void {
    this.app.use(errorMiddleware);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`✅ [API] Local: http://localhost:${port}/`);
    });
  }

  public getExpress(): Express {
    return this.app;
  }
}
