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
    getAllUBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner
} = require("../controllers/bannerController");
const {
    createMenu,
    getAllMenus,
    getMenuById,
    updateMenu,
    deleteMenu
} = require("../controllers/menuController");
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
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial
} = require("../controllers/testimonialController");
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

// Banners Module
router.get("/banners", authMiddleware, authorizeRole("admin"), getAllUBanners);
router.get("/banner/:id", authMiddleware, authorizeRole("admin"), getBannerById);
router.post("/banner/create", authMiddleware, authorizeRole("admin"), createBanner);
router.put("/banner/update/:id", authMiddleware, authorizeRole("admin"), updateBanner);
router.delete("/banner/delete/:id", authMiddleware, authorizeRole("admin"), deleteBanner);

// Menu Module
router.get("/menus", authMiddleware, authorizeRole("admin"), getAllMenus);
router.get("/menu/:id", authMiddleware, authorizeRole("admin"), getMenuById);
router.post("/menu/create", authMiddleware, authorizeRole("admin"), createMenu);
router.put("/menu/update/:id", authMiddleware, authorizeRole("admin"), updateMenu);
router.delete("/menu/delete/:id", authMiddleware, authorizeRole("admin"), deleteMenu);

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

// Testimonials Module
router.get("/testimonials", authMiddleware, authorizeRole("admin"), getAllTestimonials);
router.get("/testimonial/:id", authMiddleware, authorizeRole("admin"), getTestimonialById);
router.post("/testimonial/create", authMiddleware, authorizeRole("admin"), createTestimonial);
router.put("/testimonial/update/:id", authMiddleware, authorizeRole("admin"), updateTestimonial);
router.delete("/testimonial/delete/:id", authMiddleware, authorizeRole("admin"), deleteTestimonial);


// Images Upload
router.post("/images/upload", authMiddleware, authorizeRole("admin", "vendor"), uploadMiddleware, uploadImages);

module.exports = router;