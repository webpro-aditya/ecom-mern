const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
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
const {
    getAttributes,
    createAttribute,
    getAttributeById,
    updateAttribute,
    deleteAttribute
} = require("../controllers/attributeController");
const {
    uploadImages
} = require("../controllers/uploadImageController");

const router = express.Router();

// User Module
router.get("/users", authMiddleware, authorizeRole("admin"), getAllUsers);
router.get("/user/:id", authMiddleware, authorizeRole("admin"), getUserById);
router.post("/user/create", authMiddleware, authorizeRole("admin"), createUser);
router.put("/user/update/:id", authMiddleware, authorizeRole("admin"), updateUser);
router.delete("/user/delete/:id", authMiddleware, authorizeRole("admin"), deleteUser);

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

// Product Attributes
router.get('/attributes', authMiddleware, authorizeRole("admin", "vendor"), getAttributes);
router.post("/attribute/create", authMiddleware, authorizeRole("admin"), createAttribute);
router.get("/attribute/:id", authMiddleware, authorizeRole("admin"), getAttributeById);
router.put("/attribute/update/:id", authMiddleware, authorizeRole("admin"), updateAttribute);
router.delete("/attribute/delete/:id", authMiddleware, authorizeRole("admin"), deleteAttribute);

// Images Upload
router.post("/images/upload", authMiddleware, authorizeRole("admin", "vendor"), uploadMiddleware, uploadImages);

module.exports = router;