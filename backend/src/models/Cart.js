const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  variationId: { 
    type: mongoose.Schema.Types.ObjectId // references embedded variation _id
  },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [cartItemSchema],
});

module.exports = mongoose.model("Cart", cartSchema);
