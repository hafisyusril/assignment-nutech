import { NextFunction, Request, Response } from "express";
import { InformationService } from "./information.service";

export class InformationController {
  private informationService: InformationService;

  constructor() {
    this.informationService = new InformationService();
  }

  getBanners = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banners = await this.informationService.getBanners();
      res.status(200).json({
        status: 0,
        message: "Sukses",
        data: banners,
      });
    } catch (error) {
      next(error);
    }
  };

  getServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const services = await this.informationService.getServices();
      res.status(200).json({
        status: 0,
        message: "Sukses",
        data: services,
      });
    } catch (error) {
      next(error);
    }
  };
}
