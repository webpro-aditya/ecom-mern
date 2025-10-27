const mongoose = require("mongoose");
const slugify = require("slugify");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// Get cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "name images type price stock variations");

    if (!cart) {
      return res.json({ success: true, cart: { items: [] } });
    }

    // Manually resolve variations for variable products
    const cartObj = cart.toObject();
    cartObj.items = cartObj.items.map((item) => {
      if (item.product && item.product.type === "variable" && item.variationId) {
        const variation = item.product.variations.find(
          (v) => v._id.toString() === item.variationId.toString()
        );

        if (variation) {
          item.variation = {
            _id: variation._id,
            sku: variation.sku,
            price: variation.price,
            stock: variation.stock,
            attributes: variation.attributes,
          };

          // Override item-level fields for clarity
          item.price = variation.price;
          item.name = `${item.product.name} - ${[...variation.attributes.values()].join(", ")}`;
        }
      }

      if (item.product && item.product.type === "simple") {
        // Ensure simple product price is consistent
        item.price = item.product.price;
        item.name = item.product.name;
      }

      return item;
    });

    res.json({ success: true, cart: cartObj });
  } catch (err) {
    console.error("Error in GET /cart:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, variationId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let itemName = product.name;
    let itemPrice = product.price;

    // If variable product, pick correct variation
    if (product.type === "variable") {
      const variation = product.variations.id(variationId);
      if (!variation) {
        return res.status(400).json({ success: false, message: "Variation not found" });
      }
      itemName = `${product.name} - ${variation.name}`;
      itemPrice = variation.price;
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        (product.type === "simple" || i.variationId === variationId)
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        variationId: variationId || null,
        name: itemName,
        price: itemPrice,
        quantity,
      });
    }

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error in POST /cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    console.error("Error in PUT /cart/:itemId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove item
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    console.error("Error in DELETE /cart/:itemId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ success: true, message: "Cart cleared", cart });
  } catch (err) {
    console.error("Error in DELETE /cart:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
