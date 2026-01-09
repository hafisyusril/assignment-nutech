import { NextFunction, Request, Response } from "express";
import { MembershipService } from "./membership.service";

export class MembershipController {
  private membershipService: MembershipService;

  constructor() {
    this.membershipService = new MembershipService();
  }

  getUsers = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.membershipService.getUsers();
      res.status(200).json({
        status: 0,
        data: users,
      });
    } catch (error) {
      console.error(`Error fetching users:`, error);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch users data",
      });
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
      res.status(400).json({
        status: 102,
        message: "Registrasi gagal silahkan coba lagi",
        data: null,
      });
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
      console.error(`Error during login:`, error);
      res.status(400).json({
        status: 102,
        message: "Paramter email tidak sesuai format",
        data: null,
      });
    }
  };
}
