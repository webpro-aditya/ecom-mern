const mongoose = require("mongoose");
const slugify = require("slugify");

const variationSchema = new mongoose.Schema(
  {
    name: { type: String },
    sku: { type: String, unique: true, sparse: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String],
    attributes: [
      {
        attribute: { type: mongoose.Schema.Types.ObjectId, ref: "Attribute" },
        value: String,
      },
    ],
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: [String],
    price: { type: Number },
    stock: { type: Number, default: 0 },
    type: { type: String, enum: ["simple", "variable"], default: "simple" },
    variations: [variationSchema],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

async function generateUniqueSlug(model, name) {
  const baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await model.exists({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}

async function generateUniqueSKU(model, sku) {
  if (!sku) return null;

  const baseSku = sku.trim();
  let uniqueSku = baseSku;
  let counter = 1;

  while (await model.exists({ "variations.sku": uniqueSku })) {
    uniqueSku = `${baseSku}-${counter++}`;
  }

  return uniqueSku;
}

productSchema.pre("validate", async function (next) {
  try {
    if (this.isNew || this.isModified("name")) {
      this.slug = await generateUniqueSlug(mongoose.models.Product, this.name);
    }

    if (Array.isArray(this.variations) && this.variations.length > 0) {
      for (let variation of this.variations) {
        if (variation.sku) {
          variation.sku = await generateUniqueSKU(
            mongoose.models.Product,
            variation.sku
          );
        }
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Product", productSchema);
