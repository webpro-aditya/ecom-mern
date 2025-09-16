const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Payment Create
exports.createPayment = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, orderId } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: { orderId },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (err) {
    console.error("Error creating payment order:", err);
    res.status(500).json({ success: false, message: "Payment order creation failed" });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Generate signature using key_secret
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // ✅ Payment verified, update order status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = "paid";
    await order.save();

    res.json({ success: true, message: "Payment verified successfully", order });
  } catch (err) {
    console.error("Error in POST /api/payments/verify:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
