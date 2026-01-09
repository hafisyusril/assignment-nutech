import { Router } from "express";
import { MembershipController } from "./membership.controller";

export class MembershipRouter {
    private router : Router;
    private membershipController: MembershipController;
    
    constructor() {
        this.router = Router();
        this.membershipController = new MembershipController();
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.get("/users", this.membershipController.getUsers)
        this.router.post("/register", this.membershipController.registration)
        this.router.post("/login", this.membershipController.login)
    }

    getRouter = () => {
        return this.router;
    }
}