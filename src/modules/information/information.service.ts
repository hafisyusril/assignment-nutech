import { pool } from "../../config/db";
import { ApiError } from "../../utils/api-error";

export class InformationService {
  getBanners = async () => {
    const result = await pool.query(
      `SELECT banner_name, banner_image, description FROM banners`
    );

    if ((result.rowCount ?? 0) === 0) {
      throw new ApiError("Banners not found", 404, 1);
    }

    return result.rows;
  };

  getServices = async () => {
    const result = await pool.query(
      `SELECT service_code, service_name, service_icon, service_tariff FROM services`
    );

    if ((result.rowCount ?? 0) === 0) {
      throw new ApiError("Services not found", 404, 1);
    }

    return result.rows;
  };
}
