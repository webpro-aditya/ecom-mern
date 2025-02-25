const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    catId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    description: { type: String, required: true },
    usedQty: { type: Number, required: true, default: 0 },
    remQty: {
      type: Number,
      required: true,
      default: function () {
        return this.qty - this.usedQty;
      },
    },
    status: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
