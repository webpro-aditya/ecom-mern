const mongoose = require("mongoose");

const variationSchema = new mongoose.Schema({
  sku: { type: String, unique: true, sparse: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  attributes: {
    type: Map, // { size: "M", color: "Red" }
    of: String
  }
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  images: [String],
  price: { type: Number }, // for simple product
  stock: { type: Number, default: 0 }, // for simple product
  type: { type: String, enum: ["simple", "variable"], default: "simple" },
  variations: [variationSchema], // only for variable products
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
