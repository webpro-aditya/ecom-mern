const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
} = require("../controllers/wishlistController");

const router = express.Router();

// Cart
router.get("/cart", authMiddleware, getCart);
router.post("/cart/create", authMiddleware, addToCart);
router.put("/cart/update/:itemId", authMiddleware, updateCartItem);
router.delete("/cart/delete/:itemId", authMiddleware, removeCartItem);
router.delete("/cart/clear", authMiddleware, clearCart);

// Wishlist
router.get("/wishlist", authMiddleware, getWishlist);
router.post("/wishlist/create", authMiddleware, addToWishlist);
router.delete("/wishlist/delete/:productId", authMiddleware, removeFromWishlist);
router.post("/wishlist/move-to-cart/:productId", authMiddleware, moveToCart);

module.exports = router;
