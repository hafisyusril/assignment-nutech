import { NextFunction, Request, Response } from "express";
import { MembershipService } from "./membership.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class MembershipController {
  private membershipService: MembershipService;

  constructor() {
    this.membershipService = new MembershipService();
  }

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.membershipService.getProfile(req.user!.email);
      res.status(200).json({
        status: 0,
        message: "Sukses",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updatedProfile = await this.membershipService.updateProfile(
        req.user!.email,
        req.body
      );

      res.status(200).json({
        status: 0,
        message: "Update profile berhasil",
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfileImage = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.membershipService.updateProfileImage(
        req.user!.email,
        req.file!
      );

      res.status(200).json({
        status: 0,
        message: "update profile image berhasil",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  registration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.membershipService.registration(req.body);
      res.status(200).json({
        status: 0,
        message: "Registrasi berhasil silahkan login",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = await this.membershipService.login(req.body);
      res.status(200).json({
        status: 0,
        message: "Login berhasil",
        data: { token },
      });
    } catch (error) {
      next(error);
    }
  };
}
