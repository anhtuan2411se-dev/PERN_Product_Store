import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Route GET: Lấy danh sách tất cả sản phẩm
router.get("/", getAllProducts);

// Route GET: Lấy sản phẩm theo ID
router.get("/:id", getProductById);

// Route POST: Tạo sản phẩm mới
router.post("/", createProduct);

// Route PUT: Cập nhật sản phẩm
router.put("/:id", updateProduct);

// Route DELETE: Xóa sản phẩm
router.delete("/:id", deleteProduct);

export default router;
