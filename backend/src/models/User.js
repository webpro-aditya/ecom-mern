const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin", "delivery"],
      default: "customer",
    },
    addresses: [
      {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String },
        isDefault: { type: Boolean, default: false },
        label: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
