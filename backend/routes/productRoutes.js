import express from "express";
import {
  getProducts,
  createProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Route GET: Lấy danh sách tất cả sản phẩm
router.get("/", getProducts);

// Route POST: Tạo sản phẩm mới
router.post("/", createProduct);

export default router;
