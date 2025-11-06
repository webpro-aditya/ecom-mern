const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    verifiedPurchase: {
      type: Boolean,
      default: false
    },
    designation: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    sequence: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
