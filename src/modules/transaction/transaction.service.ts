import { pool } from "../../config/db";

export class TransactionService {
  getBalance = async (email: string) => {
    const result = await pool.query(
      `SELECT balance FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  };
}
