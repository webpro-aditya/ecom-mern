const mongoose = require("mongoose");
const slugify = require("slugify");

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    options: { type: [String], default: [] },
    type: { type: String, enum: ["select", "multiselect", "text", "number", "boolean"], default: "select" },
  },
  { timestamps: true }
);

// Auto-generate slug from name
attributeSchema.pre("validate", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Attribute", attributeSchema);
