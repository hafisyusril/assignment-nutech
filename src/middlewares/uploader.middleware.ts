import multer from "multer";
import { ApiError } from "../utils/api-error";

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new ApiError("Format Image tidak sesuai silakan pilih jpeg/png", 400));
    }
    cb(null, true);
  },
});
