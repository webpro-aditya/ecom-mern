const express = require("express");
const { cacheGet } = require("../middlewares/cacheMiddleware");

const { getHomepageData } = require("../controllers/HomepageController");
const {
  getPublicCategories,
  getNewArrivals,
  getSaleProducts,
  getFAQs,
  getPageBySlug,
  getContactInfo,
  getPublicProductById,
  getCategoryProducts,
} = require("../controllers/publicController");

const router = express.Router();

// Public endpoints (cached)
router.get("/home", cacheGet(300), getHomepageData);
router.get("/categories", cacheGet(600), getPublicCategories);
router.get("/products/new", cacheGet(300), getNewArrivals);
router.get("/products/sale", cacheGet(300), getSaleProducts);
router.get("/faqs", cacheGet(1800), getFAQs);
router.get("/pages/:slug", cacheGet(1800), getPageBySlug);
router.get("/contact", cacheGet(1800), getContactInfo);

// Product details and category listing
router.get("/products/:id", cacheGet(600), getPublicProductById);
router.get("/category/:slug/products", cacheGet(300), getCategoryProducts);

module.exports = router;
