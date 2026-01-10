import { pool } from "../../config/db";
import { ApiError } from "../../utils/api-error";
import { generateInvoiceNumber } from "../../utils/generate-invoice";
import { TopupDTO } from "./dto/topup.dto";

export class TransactionService {
  getBalance = async (email: string) => {
    const result = await pool.query(
      `SELECT balance FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  };

  topup = async (body: TopupDTO, email: string) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const userBalance = await client.query(
        `SELECT id, balance FROM users WHERE email = $1`,
        [email]
      );
      if ((userBalance.rowCount ?? 0) === 0) {
        throw new ApiError("User not found", 404, 102);
      }
      const user = userBalance.rows[0];
      const { top_up_amount } = body;
      if (top_up_amount < 0) {
        throw new ApiError(
          "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
          400,
          102
        );
      }
      const updatedUserBalance = await client.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance`,
        [top_up_amount, user.id]
      );
      const newUserBalance = updatedUserBalance.rows[0].balance;
      const invoice_number = generateInvoiceNumber();
      await client.query(
        `INSERT INTO transactions (invoice_number, user_id, transaction_type, description, top_up_amount, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [invoice_number, user.id, "TOPUP", "Top Up Balance", top_up_amount]
      );
      await client.query("COMMIT");
      return { balance: newUserBalance };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  };
}
