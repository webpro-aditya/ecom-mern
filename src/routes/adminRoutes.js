const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const {
    getProfile,
    updateProfile,
    changePassword 
} = require("../controllers/userController");
const { 
    getProducts, 
    createProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} = require("../controllers/productController");
const {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const router = express.Router();

// User Module
router.get("/profile", authMiddleware, authorizeRole("admin"), getProfile);
router.put("/profile", authMiddleware, authorizeRole("admin"), updateProfile);
router.put("/password", authMiddleware, authorizeRole("admin"), changePassword);

// Products Module
router.get("/products", authMiddleware, getProducts);
router.post("/product/create", authMiddleware, authorizeRole("admin", "vendor"), createProduct);
router.get("/product/:id", authMiddleware, authorizeRole("admin", "vendor"), getProductById);
router.put("/product/update/:id", authMiddleware, authorizeRole("admin", "vendor"), updateProduct);
router.delete("/product/delete/:id", authMiddleware, authorizeRole("admin", "vendor"), deleteProduct);

// Product Categories
router.get("/categories", authMiddleware, authorizeRole("admin", "vendor"), getCategories);
router.post("/category/create", authMiddleware, authorizeRole("admin"), createCategory);
router.get("/category/:id", authMiddleware, authorizeRole("admin", "vendor"), getCategoryById);
router.put("/category/update/:id", authMiddleware, authorizeRole("admin"), updateCategory);
router.delete("/category/delete/:id", authMiddleware, authorizeRole("admin"), deleteCategory);

module.exports = router;