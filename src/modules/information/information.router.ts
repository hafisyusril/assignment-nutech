import { Router } from "express";
import { InformationController } from "./information.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export class InformationRouter {
    private router: Router;
    private informationController: InformationController;

    constructor() {
        this.router = Router();
        this.informationController = new InformationController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/banners", this.informationController.getBanners);
        this.router.get("/services", authMiddleware, this.informationController.getServices)
    }

    getRouter() {
        return this.router;
    }
}