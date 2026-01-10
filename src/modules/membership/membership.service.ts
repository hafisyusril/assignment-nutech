import cloudinary from "../../config/cloudinary";
import { pool } from "../../config/db";
import { createToken } from "../../lib/jwt";
import { PasswordService } from "../../services/password.service";
import { ApiError } from "../../utils/api-error";

export class MembershipService {
  private passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
  }

  getProfile = async (email: string) => {
    const result = await pool.query(
      `
    SELECT 
      email,
      first_name,
      last_name,
      profile_image
    FROM users
    WHERE email = $1
    `,
      [email]
    );

    if ((result.rowCount ?? 0) === 0) {
      throw new ApiError("User not found", 404, 1);
    }
    return result.rows;
  };

  updateProfile = async (
    email: string,
    payload: {
      first_name?: string;
      last_name?: string;
    }
  ) => {
    const { first_name, last_name } = payload;

    if (!first_name && !last_name) {
      throw new ApiError("No data provided to update", 400, 1);
    }

    const result = await pool.query(
      `
    UPDATE users
    SET
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name)
    WHERE email = $3
    RETURNING 
      email,
      first_name,
      last_name
    `,
      [first_name, last_name, email]
    );

    if ((result.rowCount ?? 0) === 0) {
      throw new ApiError("User not found", 404, 1);
    }

    return result.rows[0];
  };

  updateProfileImage = async (email: string, file: Express.Multer.File) => {
    if (!file) {
      throw new ApiError("Image is required", 400, 1);
    }

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "profiles" }, (error, result) => {
          if (error || !result) {
            return reject(new ApiError("Failed to upload image", 500, 102));
          }
          resolve(result);
        })
        .end(file.buffer);
    });

    const updateResult = await pool.query(
      `
    UPDATE users
    SET profile_image = $1
    WHERE email = $2
    RETURNING 
      email,
      first_name,
      last_name,
      profile_image
    `,
      [uploadResult.secure_url, email]
    );

    if ((updateResult.rowCount ?? 0) === 0) {
      throw new ApiError("User not found", 404, 102);
    }

    return updateResult.rows[0];
  };

  registration = async (payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    const { email, password, first_name, last_name } = payload;

    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) throw new ApiError("Email is required!", 400, 102);
    if (!password) throw new ApiError("Password is required!", 400, 102);
    if (!first_name) throw new ApiError("First name is required!", 400, 102);
    if (!last_name) throw new ApiError("Last name is required!", 400, 102);

    // cek email apakah sudah terdaftar oleh user yang lain
    const checkUser = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    if ((checkUser.rowCount ?? 0) > 0) {
      throw new ApiError("Email already registered", 409, 102);
    }

    // pasword akan dihash sebelum masuk ke database
    const hashedPassword = await this.passwordService.hashPassword(password);

    const insertQuery = `
      INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        balance
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id,
        email,
        first_name,
        last_name,
        balance,
        created_at
    `;

    const result = await pool.query(insertQuery, [
      email,
      hashedPassword,
      first_name,
      last_name,
      0,
    ]);

    return result.rows[0];
  };

  login = async (body: { email: string; password: string }) => {
    const { email, password } = body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) throw new ApiError("Email is required!", 400, 102);
    if (!password) throw new ApiError("Password is required!", 400, 102);

    const result = await pool.query(
      `
    SELECT 
      id,
      email,
      password,
      first_name,
      last_name,
      balance,
      created_at
    FROM users
    WHERE email = $1
    `,
      [normalizedEmail]
    );

    if ((result.rowCount ?? 0) === 0) {
      throw new ApiError("Invalid email or password", 401, 102);
    }

    const user = result.rows[0];

    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError("Invalid email or password", 401, 102);
    }

    const payload = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    const token = createToken({
      payload,
      secretKey: process.env.JWT_SECRET_KEY!,
      options: { expiresIn: "1h" },
    });

    return { payload, token };
  };
}
