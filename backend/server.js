import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Middleware bảo mật

app.use(morgan("dev")); // Middleware ghi log

app.use(cors()); // Middleware CORS

app.use(express.json()); // Phân tích cú pháp JSON bodies

app.use("/api/products", productRoutes);

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
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
