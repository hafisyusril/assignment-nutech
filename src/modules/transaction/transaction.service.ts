import { query } from "express-validator";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/api-error";
import { generateInvoiceNumber } from "../../utils/generate-invoice";
import { TopupDTO } from "./dto/topup.dto";
import { TransactionDTO } from "./dto/transaction.dto";

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

      const userResult = await client.query(
        `SELECT id, balance FROM users WHERE email = $1`,
        [email]
      );
      if ((userResult.rowCount ?? 0) === 0) {
        throw new ApiError("User not found", 404, 102);
      }
      const user = userResult.rows[0];

      const amount = Number(body.top_up_amount);
      if (isNaN(amount) || amount < 1) {
        throw new ApiError(
          "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 1",
          400,
          102
        );
      }
      const updatedUserBalance = await client.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance`,
        [amount, user.id]
      );

      const newUserBalance = Number(updatedUserBalance.rows[0].balance);

      const invoice_number = generateInvoiceNumber();

      await client.query(
        `INSERT INTO transactions (invoice_number, user_id, transaction_type, description, total_amount, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [invoice_number, user.id, "TOPUP", "Top Up Balance", amount]
      );
      await client.query("COMMIT");
      return { balance: newUserBalance };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  transaction = async (body: TransactionDTO, email: string) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const userResult = await client.query(
        `SELECT id, balance FROM users WHERE email = $1`,
        [email]
      );
      if ((userResult.rowCount ?? 0) === 0) {
        throw new ApiError("User not found", 404, 102);
      }

      const user = userResult.rows[0];

      const serviceResult = await client.query(
        `SELECT id, service_name, service_tariff, service_code FROM services WHERE service_code = $1`,
        [body.service_code]
      );
      if ((serviceResult.rowCount ?? 0) === 0) {
        throw new ApiError("Service atau layanan tidak ditemukan", 400, 102);
      }

      const service = serviceResult.rows[0];

      const userBalance = Number(user.balance);
      const serviceTariff = Number(service.service_tariff);

      if (userBalance < serviceTariff) {
        throw new ApiError(
          "Saldo tidak cukup untuk melakukan transaksi",
          400,
          102
        );
      }

      await client.query(
        `UPDATE users SET balance = balance - $1 WHERE id = $2 RETURNING balance`,
        [serviceTariff, user.id]
      );
      const invoice_number = generateInvoiceNumber();
      const transactionResult = await client.query(
        `INSERT INTO transactions (invoice_number, user_id, service_id, transaction_type, description, total_amount, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
        [
          invoice_number,
          user.id,
          service.id,
          "PAYMENT",
          service.service_name,
          serviceTariff,
        ]
      );
      const transaction = transactionResult.rows[0];

      await client.query("COMMIT");

      return {
        invoice_number,
        service_code: body.service_code,
        service_name: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: serviceTariff,
        created_at: transaction.created_at,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  transactionHistory = async (
    email: string,
    limit?: number,
    offset?: number
  ) => {
    const userResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if ((userResult.rowCount ?? 0) === 0) {
      throw new ApiError("User not found", 404, 102);
    }

    const userId = userResult.rows[0].id;

    let query = `SELECT invoice_number, transaction_type, description, total_amount, created_at AS created_on FROM transactions WHERE user_id = $1 ORDER BY created_at DESC`;

    const values: any[] = [userId];

    if (limit !== undefined) {
      values.push(limit);
      query += ` LIMIT $${values.length} `;
    }
    if (offset !== undefined) {
      values.push(offset);
      query += ` OFFSET $${values.length}`;
    }

    const result = await pool.query(query, values);

    const records = result.rows.map((row) => ({
      ...row,
      total_amount: Number(row.total_amount),
    }));

    return {
      offset: offset ?? 0,
      limit: limit ?? records.length,
      records,
    };
  };
}
