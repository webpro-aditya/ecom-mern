const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { statusFlow } = require("../constants/constants");


// Get Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .populate("items.product", "name images type price stock variations");

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error in GET /orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get current user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name images type price stock variations");

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error in GET /orders/my:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get order details by id
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email role")
      .populate("items.product", "name images type price stock variations");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Authorization: user can only view their own order unless admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("Error in GET /order/:id:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create new Order
exports.placeOrder = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const {
      fromCart = true,
      items = [],
      shippingAddress,
      paymentMethod = "cod",
    } = req.body;

    let orderItems = [];
    let totalAmount = 0;

    if (fromCart) {
      // Case 1: Checkout from cart
      const cart = await Cart.findOne({ user: req.user.id }).populate(
        "items.product"
      );
      if (!cart || cart.items.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ success: false, message: "Cart is empty" });
      }

      for (let item of cart.items) {
        const product = await Product.findById(item.product._id).session(
          session
        );
        if (!product) throw new Error("Product not found");

        // Deduct stock
        if (item.variationId) {
          const variation = product.variations.id(item.variationId);
          if (!variation || variation.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          variation.stock -= item.quantity;
        } else {
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          product.stock -= item.quantity;
        }
        await product.save({ session });

        orderItems.push({
          product: product._id,
          variationId: item.variationId || null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });

        totalAmount += item.price * item.quantity;
      }

      // Clear cart
      cart.items = [];
      await cart.save({ session });
    } else {
      // Case 2: Direct checkout
      for (let i of items) {
        const product = await Product.findById(i.productId).session(session);
        if (!product) throw new Error("Product not found");

        let itemName = product.name;
        let itemPrice = product.price;

        if (product.type === "variable") {
          if (!i.variationId) {
            throw new Error(
              `VariationId required for variable product: ${product.name}`
            );
          }
          const variation = product.variations.id(i.variationId);
          if (!variation || variation.stock < (i.quantity || 1)) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          variation.stock -= i.quantity || 1;
          itemName = `${product.name} - ${[
            ...variation.attributes.values(),
          ].join(", ")}`;
          itemPrice = variation.price;
        } else {
          if (product.stock < (i.quantity || 1)) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          product.stock -= i.quantity || 1;
        }

        await product.save({ session });

        orderItems.push({
          product: product._id,
          variationId: i.variationId || null,
          name: itemName,
          price: itemPrice,
          quantity: i.quantity || 1,
        });

        totalAmount += itemPrice * (i.quantity || 1);
      }
    }

    // Create order
    const newOrder = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      status: "pending",
      shippingAddress,
      paymentMethod,
      stockDeducted: true,
    });

    await newOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Populate user + product
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("user", "name email role")
      .populate("items.product", "name price stock type");

    res.json({ success: true, order: populatedOrder });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in POST /orders:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

// Rollback Stock on Order failed
exports.rollbackOrderStock = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (!order.stockDeducted) {
      await session.abortTransaction();
      session.endSession();
      return res.json({ success: true, message: "Stock was not deducted" });
    }

    // Loop items and restore stock
    for (let item of order.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) continue;

      if (product.type === "simple") {
        product.stock += item.quantity;
      } else {
        const variation = product.variations.id(item.variationId);
        if (variation) variation.stock += item.quantity;
      }
      await product.save({ session });
    }

    // Update order status
    order.status = "failed";
    order.stockDeducted = false; // reset flag
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: "Stock rollback completed", order });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in rollback:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    const allowedNextStatuses = statusFlow[order.status] || [];

    if (!allowedNextStatuses.includes(status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Invalid status transition from '${order.status}' to '${status}'`,
      });
    }

    // ✅ If cancelling, restore stock
    if (status === "cancelled" && order.stockDeducted) {
      for (const item of order.items) {
        const product = await Product.findById(item.product).session(session);
        if (!product) continue;

        if (item.variationId) {
          // handle variable product
          const variation = product.variations.id(item.variationId);
          if (variation) {
            variation.stock += item.quantity;
          }
        } else {
          // handle simple product
          product.stock += item.quantity;
        }

        await product.save({ session });
      }

      order.stockDeducted = false; // rollback marker
    }

    order.status = status;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
}