import { sql } from "../config/db.js";

// Lấy danh sách tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const result = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM products WHERE id = ${id}`;

    if (result.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({ error: "Tên và giá là bắt buộc" });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({ error: "Giá phải là số dương" });
    }

    const result = await sql`
      INSERT INTO products (name, price, image)
      VALUES (${name}, ${price}, ${image})
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image } = req.body;

    const result = await sql`
      UPDATE products 
      SET name = ${name}, price = ${price}, image = ${image}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.json({ message: "Xóa sản phẩm thành công", product: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
