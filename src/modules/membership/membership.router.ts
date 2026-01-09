import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { MembershipController } from "./membership.controller";
import { upload } from "../../middlewares/uploader.middleware";

export class MembershipRouter {
  private router: Router;
  private membershipController: MembershipController;

  constructor() {
    this.router = Router();
    this.membershipController = new MembershipController();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(
      "/users",
      authMiddleware,
      this.membershipController.getProfile
    );
    this.router.post("/register", this.membershipController.registration);
    this.router.post("/login", this.membershipController.login);
    this.router.put(
      "/profile/update",
      authMiddleware,
      this.membershipController.updateProfile
    );
    this.router.put(
      "/profile/image",
      authMiddleware,
      upload.single("profile_image"),
      this.membershipController.updateProfileImage
    );
  };

  getRouter = () => {
    return this.router;
  };
}
