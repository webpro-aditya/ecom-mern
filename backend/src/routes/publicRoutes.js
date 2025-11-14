const express = require("express");

const { getHomepageData } = require("../controllers/HomepageController");
const {
  getPublicCategories,
  getNewArrivals,
  getSaleProducts,
  getFAQs,
  getPageBySlug,
  getContactInfo,
} = require("../controllers/publicController");

const router = express.Router();

// Categories
router.get("/home", getHomepageData);
router.get("/categories", getPublicCategories);
router.get("/products/new", getNewArrivals);
router.get("/products/sale", getSaleProducts);
router.get("/faqs", getFAQs);
router.get("/pages/:slug", getPageBySlug);
router.get("/contact", getContactInfo);

module.exports = router;
