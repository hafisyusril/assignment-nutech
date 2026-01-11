import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { MembershipController } from "./membership.controller";
import { upload } from "../../middlewares/uploader.middleware";
import { validateDtoMiddleware } from "../../middlewares/validate.dto.middleware";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";

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
      "/user",
      authMiddleware,
      this.membershipController.getProfile
    );
    this.router.post(
      "/register",
      validateDtoMiddleware(RegisterDTO),
      this.membershipController.registration
    );
    this.router.post(
      "/login",
      validateDtoMiddleware(LoginDTO),
      this.membershipController.login
    );
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
