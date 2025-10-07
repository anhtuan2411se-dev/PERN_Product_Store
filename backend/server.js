import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Middleware bảo mật

app.use(morgan("dev")); // Middleware ghi log

app.use(cors()); // Middleware CORS

app.use(express.json()); // Phân tích cú pháp JSON bodies

// Middleware Arcjet - Áp dụng trước tất cả các route
app.use(async (req, res, next) => {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    // Kiểm tra lý do bị từ chối
    if (decision.reason.isRateLimit()) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Bạn đã vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.",
      });
    }

    if (decision.reason.isBot()) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Bot không được phép truy cập.",
      });
    }

    // Các trường hợp từ chối khác
    return res.status(403).json({
      error: "Forbidden",
      message: "Yêu cầu bị từ chối.",
    });
  }

  // Nếu được phép, tiếp tục xử lý request
  next();
});

// Route API cho sản phẩm
app.use("/api/products", productRoutes);

// Hàm khởi tạo database
// Tạo bảng products nếu chưa tồn tại
async function initDB() {
  try {
    // Tạo bảng products với các trường:
    // - id: khóa chính tự động tăng
    // - name: tên sản phẩm (bắt buộc)
    // - image: đường dẫn hình ảnh (bắt buộc)
    // - price: giá sản phẩm (bắt buộc)
    // - created_at: thời gian tạo (mặc định là thời gian hiện tại)
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Kết nối đến database thành công");
  } catch (error) {
    console.error("Lỗi kết nối đến database:", error);
  }
}

// Route mặc định - Kiểm tra server đang chạy
app.get("/", (req, res) => {
  res.send("Server đang chạy");
});

// Route test - Kiểm tra API hoạt động
app.get("/test", (req, res) => {
  res.json({
    message: "Route test đang hoạt động!",
    timestamp: new Date().toISOString(),
  });
});

// Khởi động server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });
});
