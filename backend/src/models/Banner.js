const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true // could be a URL or file path
    },
    htmlContent: {
      type: String,
      default: ""
    },
    sequence: {
      type: Number,
      default: 0
    },
    redirectUrl: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
