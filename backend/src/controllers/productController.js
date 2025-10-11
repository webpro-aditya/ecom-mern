const mongoose = require("mongoose");
const slugify = require("slugify");
const Product = require("../models/Product");
const Category = require("../models/Category");

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};

    // Category filter: accept ID or slug
    if (category) {
      const query = mongoose.Types.ObjectId.isValid(category)
        ? { $or: [{ _id: category }, { slug: category }, { name: category }] }
        : { $or: [{ slug: category }, { name: category }] };

      const categoryDoc = await Category.findOne(query);

      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: "No product with this category found.",
        });
      }

      filter.category = categoryDoc._id;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Price filter (for both simple and variable products)
    if (minPrice || maxPrice) {
      const priceConditions = [];

      const simplePriceFilter = {};
      if (minPrice) simplePriceFilter.$gte = Number(minPrice);
      if (maxPrice) simplePriceFilter.$lte = Number(maxPrice);
      priceConditions.push({ type: "simple", price: simplePriceFilter });

      const variationPriceFilter = {};
      if (minPrice) variationPriceFilter.$gte = Number(minPrice);
      if (maxPrice) variationPriceFilter.$lte = Number(maxPrice);
      priceConditions.push({
        type: "variable",
        "variations.price": variationPriceFilter,
      });

      const existingConditions = [];
      if (filter.category)
        existingConditions.push({ category: filter.category });
      if (filter.$or) existingConditions.push({ $or: filter.$or });
      existingConditions.push({ $or: priceConditions });

      filter = { $and: existingConditions };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let products = await Product.find(filter)
      .populate("createdBy", "name email role")
      .populate("category", "name slug parent") // ✅ populate category info
      .skip(skip)
      .limit(Number(limit));

    // Filter variable product variations by price if needed
    if (minPrice || maxPrice) {
      const minP = minPrice ? Number(minPrice) : 0;
      const maxP = maxPrice ? Number(maxPrice) : Infinity;

      products = products.map((product) => {
        if (product.type === "variable") {
          const filteredVariations = product.variations.filter(
            (v) => v.price >= minP && v.price <= maxP
          );
          return { ...product.toObject(), variations: filteredVariations };
        }
        return product;
      });
    }

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products,
    });
  } catch (error) {
    console.error("Error in GET /products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create new Product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      images,
      price,
      stock,
      type,
      variations,
      category,
      subcategory,
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and product type are required",
      });
    }

    let categoryId = null;
    let subcategoryId = null;

    if (category) {
      const categoryDoc = await Category.findOne(
        mongoose.Types.ObjectId.isValid(category)
          ? { _id: category, parent: null }
          : { slug: category, parent: null }
      );

      if (!categoryDoc) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid parent category" });
      }
      categoryId = categoryDoc._id;
    }

    if (subcategory) {
      const subcategoryDoc = await Category.findOne(
        mongoose.Types.ObjectId.isValid(subcategory)
          ? { _id: subcategory, parent: categoryId }
          : { slug: subcategory, parent: categoryId }
      );

      if (!subcategoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory for given category",
        });
      }
      subcategoryId = subcategoryDoc._id;
    }

    const slug = slugify(name, { lower: true, strict: true });

    const product = new Product({
      name,
      slug,
      description,
      type,
      category: categoryId,
      subcategory: subcategoryId,
      createdBy: req.user.id,
    });

    if (type === "simple") {
      if (!price)
        return res.status(400).json({
          success: false,
          message: "Price is required for simple products",
        });

      if (!images || !Array.isArray(images) || images.length === 0)
        return res.status(400).json({
          success: false,
          message: "At least one image is required for simple products",
        });

      product.price = price;
      product.stock = stock || 0;
      product.images = images;
    }

    if (type === "variable") {
      if (!Array.isArray(variations) || variations.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one variation is required for variable products",
        });
      }

      for (let variation of variations) {
        if (
          !variation.name ||
          !variation.price ||
          !Array.isArray(variation.images) ||
          variation.images.length === 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Each variation must include name, price, and at least one image",
          });
        }
      }

      product.variations = variations;
      product.images = [];
    }

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error in POST /product/create", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Retrieve a Product by Id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { minPrice, maxPrice } = req.query;

    let product = await Product.findOne(
      mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id }
    )
      .populate("createdBy", "name email role")
      .populate("category", "name slug parent"); // ✅ populate category info

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let productObj = product.toObject();

    if (minPrice || maxPrice) {
      const minP = minPrice ? Number(minPrice) : 0;
      const maxP = maxPrice ? Number(maxPrice) : Infinity;

      if (productObj.type === "variable") {
        productObj.variations = productObj.variations.filter(
          (v) => v.price >= minP && v.price <= maxP
        );
      } else if (productObj.type === "simple") {
        if (productObj.price < minP || productObj.price > maxP) {
          return res.status(404).json({
            success: false,
            message: "Product does not match the price filter",
          });
        }
      }
    }

    if (productObj.type === "variable" && productObj.variations.length > 0) {
      const prices = productObj.variations.map((v) => v.price);
      productObj.minPrice = Math.min(...prices);
      productObj.maxPrice = Math.max(...prices);
    } else if (productObj.type === "simple") {
      productObj.minPrice = productObj.price;
      productObj.maxPrice = productObj.price;
    }

    res.json({ success: true, product: productObj });
  } catch (err) {
    console.error("Error in GET /products/:id:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update a Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      images,
      price,
      stock,
      type,
      variations,
      category,
      subcategory,
    } = req.body;

    let product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let categoryId = product.category;
    let subcategoryId = product.subcategory;

    if (category) {
      const categoryDoc = await Category.findOne(
        mongoose.Types.ObjectId.isValid(category)
          ? { _id: category, parent: null }
          : { slug: category, parent: null }
      );

      if (!categoryDoc) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid parent category" });
      }
      categoryId = categoryDoc._id;
    }

    if (subcategory) {
      const subcategoryDoc = await Category.findOne(
        mongoose.Types.ObjectId.isValid(subcategory)
          ? { _id: subcategory, parent: categoryId }
          : { slug: subcategory, parent: categoryId }
      );

      if (!subcategoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory for given category",
        });
      }
      subcategoryId = subcategoryDoc._id;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (type) product.type = type;
    if (categoryId) product.category = categoryId;
    if (subcategoryId) product.subcategory = subcategoryId;

    if (type === "simple") {
      if (price !== undefined) product.price = price;
      if (stock !== undefined) product.stock = stock;

      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one image is required for simple products",
        });
      }

      product.images = images;
      product.variations = [];
    }

    if (type === "variable") {
      if (!Array.isArray(variations) || variations.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one variation is required for variable products",
        });
      }

      for (let v of variations) {
        if (
          !v.name ||
          !v.price ||
          !Array.isArray(v.images) ||
          v.images.length === 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Each variation must include name, price, and at least one image",
          });
        }
      }

      product.variations = variations.map((v) => ({
        name: v.name,
        sku: v.sku,
        price: v.price,
        stock: v.stock || 0,
        images: v.images,
        attributes: v.attributes || {},
      }));

      product.price = undefined;
      product.stock = undefined;
      product.images = [];
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error in PUT /products/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "category",
      "name slug"
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Role-based access: only admin or the user who created the product
    if (
      req.user.role !== "admin" &&
      product.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /products/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
