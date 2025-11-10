const express = require("express");

const {
  getHomepageData,
} = require("../controllers/HomepageController");

const router = express.Router();

// Categories
router.get("/home", getHomepageData);

module.exports = router;