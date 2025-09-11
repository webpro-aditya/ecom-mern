const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Wishlist = require("../models/Wishlist");

// GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate("items.product", "name images type price stock");

    res.json({
      success: true,
      wishlist: wishlist || { items: [] },
    });
  } catch (err) {
    console.error("Error in GET /wishlist:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, items: [] });
    }

    const alreadyInWishlist = wishlist.items.find(
      (i) => i.product.toString() === productId
    );

    if (alreadyInWishlist) {
      return res.json({ success: true, message: "Already in wishlist", wishlist });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();

    res.json({ success: true, wishlist });
  } catch (err) {
    console.error("Error in POST /wishlist:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/wishlist/:productId
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (i) => i.product.toString() !== productId
    );

    await wishlist.save();

    res.json({ success: true, wishlist });
  } catch (err) {
    console.error("Error in DELETE /wishlist/:productId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/wishlist/move-to-cart/:productId
exports.moveToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Get wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    // Remove from wishlist
    wishlist.items = wishlist.items.filter(
      (i) => i.product.toString() !== productId
    );
    await wishlist.save();

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // If product already in cart, increment qty
    const existingItem = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Product moved to cart",
      cart,
      wishlist,
    });
  } catch (err) {
    console.error("Error in POST /wishlist/move-to-cart/:productId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

