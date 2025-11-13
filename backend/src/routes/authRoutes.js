const express = require("express");
const {
    register,
    login,
    logout,
    getMe,
    updateMe
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const dbHealth = require("../middlewares/dbHealthMiddleware");
const { validateAuthRegister, validateAuthLogin } = require("../middlewares/validate");

const router = express.Router();

router.post("/register", dbHealth, validateAuthRegister, register);
router.post("/login", dbHealth, validateAuthLogin, login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

module.exports = router;
