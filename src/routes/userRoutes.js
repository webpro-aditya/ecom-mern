const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/userController");
const { 
    getProducts, 
    createProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} = require("../controllers/productController");
const { 
    createCategory, 
    getCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

// Products
router.get("/products", authMiddleware, getProducts);
router.post("/product/create", authMiddleware, createProduct);
router.get("/product/:id", getProductById);
router.put("/product/update/:id", updateProduct);
router.delete("/product/delete/:id", deleteProduct);

//Category
router.post("/category/create", createCategory);
router.get("/categories", getCategories);
router.get("/category/:id", getCategoryById);
router.put("/category/update/:id", updateCategory);
router.delete("/category/delete/:id", deleteCategory);

module.exports = router;
