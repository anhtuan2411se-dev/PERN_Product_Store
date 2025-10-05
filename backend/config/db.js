import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

// Lấy thông tin kết nối database từ biến môi trường
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Tạo kết nối đến Neon PostgreSQL database với SSL
export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:5432/${PGDATABASE}?sslmode=require`
);
