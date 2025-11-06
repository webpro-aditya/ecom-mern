const mongoose = require("mongoose");
const slugify = require("slugify");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Attribute = require("../models/Attribute");

// Get All Products
exports.getProducts = async (req, res) => {
  try {
     const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      type,
      isActive,
      isFeatured,
    } = req.query;

    let filter = {};

    if (type) filter.type = type;

    // ✅ new filters
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }

    // ✅ category filter
    if (category) {
      const categoryQuery = mongoose.Types.ObjectId.isValid(category)
        ? { $or: [{ _id: category }, { slug: category }, { name: category }] }
        : { $or: [{ slug: category }, { name: category }] };

      const categoryDoc = await Category.findOne({
        ...categoryQuery,
        parent: null,
      });

      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: "No matching parent category found.",
        });
      }

      filter.category = categoryDoc._id;
    }

    // ✅ subcategory filter
    if (subcategory) {
      const subcategoryQuery = mongoose.Types.ObjectId.isValid(subcategory)
        ? { $or: [{ _id: subcategory }, { slug: subcategory }, { name: subcategory }] }
        : { $or: [{ slug: subcategory }, { name: subcategory }] };

      const subcategoryDoc = await Category.findOne({
        ...subcategoryQuery,
        parent: filter.category || { $ne: null },
      });

      if (!subcategoryDoc) {
        return res.status(400).json({
          success: false,
          message: "No matching subcategory found for given category.",
        });
      }

      filter.subcategory = subcategoryDoc._id;
    }

    // ✅ text search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ price range filter (both simple + variable)
    if (minPrice || maxPrice) {
      const simplePriceFilter = {};
      if (minPrice) simplePriceFilter.$gte = Number(minPrice);
      if (maxPrice) simplePriceFilter.$lte = Number(maxPrice);

      const variationPriceFilter = {};
      if (minPrice) variationPriceFilter.$gte = Number(minPrice);
      if (maxPrice) variationPriceFilter.$lte = Number(maxPrice);

      filter.$or = [
        { type: "simple", price: simplePriceFilter },
        { type: "variable", "variations.price": variationPriceFilter },
      ];
    }

    // ✅ pagination
    const skip = (Number(page) - 1) * Number(limit);

    let products = await Product.find(filter)
      .populate("createdBy", "name email role")
      .populate("category", "name slug")
      .populate("subcategory", "name slug parent")
      .populate("variations.attributes.attribute", "name slug type")
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // ✅ post-filter variation prices
    if (minPrice || maxPrice) {
      const minP = minPrice ? Number(minPrice) : 0;
      const maxP = maxPrice ? Number(maxPrice) : Infinity;

      products = products.map((product) => {
        if (product.type === "variable") {
          product.variations = product.variations.filter(
            (v) => v.price >= minP && v.price <= maxP
          );
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
      isFeatured,
      isActive
    } = req.body;

    if (!name || !type) {
      return res
        .status(400)
        .json({
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
      isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,
      isActive: typeof isActive === "boolean" ? isActive : true,
      createdBy: req.user.id,
    });

    if (type === "simple") {
      if (!price)
        return res
          .status(400)
          .json({
            success: false,
            message: "Price is required for simple product",
          });

      if (!images || !Array.isArray(images) || images.length === 0)
        return res
          .status(400)
          .json({ success: false, message: "At least one image is required" });

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

      const processedVariations = [];

      for (const variation of variations) {
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

        const attrEntries = Object.entries(variation.attributes || {});
        const formattedAttributes = [];

        for (const [attrId, value] of attrEntries) {
          if (!mongoose.Types.ObjectId.isValid(attrId)) {
            return res.status(400).json({
              success: false,
              message: `Invalid attribute ID: ${attrId}`,
            });
          }

          const attrDoc = await Attribute.findById(attrId);
          if (!attrDoc) {
            return res.status(400).json({
              success: false,
              message: `Attribute not found: ${attrId}`,
            });
          }

          formattedAttributes.push({
            attribute: attrDoc._id,
            value: value,
          });
        }

        processedVariations.push({
          name: variation.name,
          sku: variation.sku,
          price: variation.price,
          stock: variation.stock || 0,
          images: variation.images,
          attributes: formattedAttributes,
        });
      }

      product.variations = processedVariations;
      product.images = [];
    }

    const savedProduct = await product.save();

    const populatedProduct = await Product.findById(savedProduct._id)
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("variations.attributes.attribute", "name slug type");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("Error in POST /product/create:", error);
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
      .populate("category", "name slug")
      .populate("subcategory", "name slug parent")
      .populate("variations.attributes.attribute", "name slug type")
      .lean();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (minPrice || maxPrice) {
      const minP = minPrice ? Number(minPrice) : 0;
      const maxP = maxPrice ? Number(maxPrice) : Infinity;

      if (product.type === "variable") {
        product.variations = product.variations.filter(
          (v) => v.price >= minP && v.price <= maxP
        );

        if (product.variations.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No variations found within price range",
          });
        }
      } else if (product.type === "simple") {
        if (product.price < minP || product.price > maxP) {
          return res.status(404).json({
            success: false,
            message: "Product does not match the price filter",
          });
        }
      }
    }

    if (product.type === "variable" && product.variations.length > 0) {
      const prices = product.variations.map((v) => v.price);
      product.minPrice = Math.min(...prices);
      product.maxPrice = Math.max(...prices);
    } else if (product.type === "simple") {
      product.minPrice = product.price;
      product.maxPrice = product.price;
    }

    if (product.type === "variable") {
      product.variations = product.variations.map((v) => ({
        name: v.name,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
        images: v.images,
        attributes: v.attributes.map((a) => ({
          attribute: a.attribute
            ? {
                id: a.attribute._id,
                name: a.attribute.name,
                slug: a.attribute.slug,
                type: a.attribute.type,
              }
            : null,
          value: a.value,
        })),
      }));
    }

    res.json({
      success: true,
      product,
    });
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
      isActive, 
      isFeatured, 
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

    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true });
    }
    if (description) product.description = description;
    if (type) product.type = type;
    if (categoryId) product.category = categoryId;
    if (subcategoryId) product.subcategory = subcategoryId;

    if (type === "simple") {
      if (!price) {
        return res.status(400).json({
          success: false,
          message: "Price is required for simple product",
        });
      }

      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one image is required for simple product",
        });
      }

      product.price = price;
      product.stock = stock || 0;
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

      const processedVariations = [];

      for (const variation of variations) {
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

        const attrEntries = Object.entries(variation.attributes || {});
        const formattedAttributes = [];

        for (const [key, value] of attrEntries) {
          let attrId = value.attribute.id;
          if (!mongoose.Types.ObjectId.isValid(attrId)) {
            return res.status(400).json({
              success: false,
              message: `Invalid attribute ID: ${attrId}`,
            });
          }

          const attrDoc = await Attribute.findById(attrId);
          if (!attrDoc) {
            return res.status(400).json({
              success: false,
              message: `Attribute not found: ${attrId}`,
            });
          }

          formattedAttributes.push({
            attrId: attrDoc.value
          });
        }

        processedVariations.push({
          name: variation.name,
          sku: variation.sku,
          price: variation.price,
          stock: variation.stock || 0,
          images: variation.images,
          attributes: formattedAttributes,
        });
      }

      product.variations = processedVariations;
      product.images = [];
      product.price = undefined;
      product.stock = undefined;
    }

    if (isActive !== undefined) product.isActive = isActive;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;

    const savedProduct = await product.save();

    const populatedProduct = await Product.findById(savedProduct._id)
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("variations.attributes.attribute", "name slug type");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: populatedProduct,
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
