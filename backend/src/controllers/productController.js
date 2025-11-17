const mongoose = require("mongoose");
const slugify = require("slugify");
const Attribute = require("../models/Attribute");
const Brand = require("../models/Brand");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { delByPattern } = require("../config/redis");

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      brand,          // ✅ new
      subbrand,       // ✅ new
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

    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";

    // ✅ category filter (id/slug/name)
    if (category) {
      const categoryQuery = mongoose.Types.ObjectId.isValid(category)
        ? { $or: [{ _id: category }, { slug: category }, { name: category }] }
        : { $or: [{ slug: category }, { name: category }] };

      const categoryDoc = await Category.findOne({ ...categoryQuery, parent: null });
      if (!categoryDoc) {
        return res.status(400).json({ success: false, message: "No matching parent category found." });
      }
      filter.category = categoryDoc._id;
    }

    // ✅ subcategory filter (id/slug/name; tied to category when provided)
    if (subcategory) {
      const subcategoryQuery = mongoose.Types.ObjectId.isValid(subcategory)
        ? { $or: [{ _id: subcategory }, { slug: subcategory }, { name: subcategory }] }
        : { $or: [{ slug: subcategory }, { name: subcategory }] };

      const subcategoryDoc = await Category.findOne({
        ...subcategoryQuery,
        parent: filter.category || { $ne: null },
      });
      if (!subcategoryDoc) {
        return res.status(400).json({ success: false, message: "No matching subcategory found for given category." });
      }
      filter.subcategory = subcategoryDoc._id;
    }

    // ✅ brand filter (id/slug/name)
    if (brand) {
      const brandQuery = mongoose.Types.ObjectId.isValid(brand)
        ? { $or: [{ _id: brand }, { slug: brand }, { name: brand }] }
        : { $or: [{ slug: brand }, { name: brand }] };

      const brandDoc = await Brand.findOne({ ...brandQuery, parent: null });
      if (!brandDoc) {
        return res.status(400).json({ success: false, message: "No matching parent brand found." });
      }
      filter.brand = brandDoc._id;
    }

    // ✅ subbrand filter (id/slug/name; tied to brand when provided)
    if (subbrand) {
      const subbrandQuery = mongoose.Types.ObjectId.isValid(subbrand)
        ? { $or: [{ _id: subbrand }, { slug: subbrand }, { name: subbrand }] }
        : { $or: [{ slug: subbrand }, { name: subbrand }] };

      const subbrandDoc = await Brand.findOne({
        ...subbrandQuery,
        parent: filter.brand || { $ne: null },
      });
      if (!subbrandDoc) {
        return res.status(400).json({ success: false, message: "No matching subbrand found for given brand." });
      }
      filter.subbrand = subbrandDoc._id;
    }

    // ✅ text search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ price range (simple + variable)
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

    const skip = (Number(page) - 1) * Number(limit);

    let products = await Product.find(filter)
      .populate("createdBy", "name email role")
      .populate("category", "name slug")
      .populate("subcategory", "name slug parent")
      .populate("brand", "name slug")           // ✅
      .populate("subbrand", "name slug parent") // ✅
      .populate("variations.attributes.attribute", "name slug type")
      .skip(skip)
      .limit(Number(limit))
      .lean();

    if (minPrice || maxPrice) {
      const minP = minPrice ? Number(minPrice) : 0;
      const maxP = maxPrice ? Number(maxPrice) : Infinity;
      products = products.map(p => {
        if (p.type === "variable") {
          p.variations = p.variations.filter(v => v.price >= minP && v.price <= maxP);
        }
        return p;
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
      brand,     
      subbrand,
      isFeatured,
      isActive
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: "Name and product type are required" });
    }

    // ✅ resolve category/subcategory by ID (creation: IDs only)
    let categoryId = null;
    let subcategoryId = null;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ success: false, message: "Invalid parent category ID" });
      }
      const categoryDoc = await Category.findOne({ _id: category, parent: null });
      if (!categoryDoc) return res.status(400).json({ success: false, message: "Invalid parent category" });
      categoryId = categoryDoc._id;
    }

    if (subcategory) {
      if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({ success: false, message: "Invalid subcategory ID" });
      }
      const subcategoryDoc = await Category.findOne({ _id: subcategory, parent: categoryId });
      if (!subcategoryDoc) {
        return res.status(400).json({ success: false, message: "Invalid subcategory for given category" });
      }
      subcategoryId = subcategoryDoc._id;
    }

    // ✅ resolve brand/subbrand by ID (creation: IDs only)
    let brandId = null;
    let subbrandId = null;

    if (brand) {
      if (!mongoose.Types.ObjectId.isValid(brand)) {
        return res.status(400).json({ success: false, message: "Invalid parent brand ID" });
      }
      const brandDoc = await Brand.findOne({ _id: brand, parent: null });
      if (!brandDoc) return res.status(400).json({ success: false, message: "Invalid parent brand" });
      brandId = brandDoc._id;
    }

    if (subbrand) {
      if (!mongoose.Types.ObjectId.isValid(subbrand)) {
        return res.status(400).json({ success: false, message: "Invalid subbrand ID" });
      }
      const subbrandDoc = await Brand.findOne({ _id: subbrand, parent: brandId });
      if (!subbrandDoc) {
        return res.status(400).json({ success: false, message: "Invalid subbrand for given brand" });
      }
      subbrandId = subbrandDoc._id;
    }

    const slug = slugify(name, { lower: true, strict: true });

    const product = new Product({
      name,
      slug,
      description,
      type,
      category: categoryId,
      subcategory: subcategoryId,
      brand: brandId,           // ✅
      subbrand: subbrandId,     // ✅
      isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,
      isActive: typeof isActive === "boolean" ? isActive : true,
      createdBy: req.user.id,
    });

    if (type === "simple") {
      if (!price) {
        return res.status(400).json({ success: false, message: "Price is required for simple product" });
      }
      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ success: false, message: "At least one image is required" });
      }
      product.price = price;
      product.stock = stock || 0;
      product.images = images;
    }

    if (type === "variable") {
      if (!Array.isArray(variations) || variations.length === 0) {
        return res.status(400).json({ success: false, message: "At least one variation is required for variable products" });
      }

      const processedVariations = [];
      for (const variation of variations) {
        if (!variation.name || !variation.price || !Array.isArray(variation.images) || variation.images.length === 0) {
          return res.status(400).json({ success: false, message: "Each variation must include name, price, and at least one image" });
        }

        const attrEntries = Object.entries(variation.attributes || {});
        const formattedAttributes = [];
        for (const [attrId, value] of attrEntries) {
          if (!mongoose.Types.ObjectId.isValid(attrId)) {
            return res.status(400).json({ success: false, message: `Invalid attribute ID: ${attrId}` });
          }
          const attrDoc = await Attribute.findById(attrId);
          if (!attrDoc) return res.status(400).json({ success: false, message: `Attribute not found: ${attrId}` });
          formattedAttributes.push({ attribute: attrDoc._id, value });
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
      .populate("subcategory", "name slug parent")
      .populate("brand", "name slug")            // ✅
      .populate("subbrand", "name slug parent")  // ✅
      .populate("variations.attributes.attribute", "name slug type");

    await delByPattern("cache:/api/public/products/new*");
    await delByPattern("cache:/api/public/products/sale*");
    await delByPattern("cache:/api/public/home*");

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
      .populate("brand", "name slug")            // ✅
      .populate("subbrand", "name slug parent")  // ✅
      .populate("variations.attributes.attribute", "name slug type")
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (minPrice || maxPrice) {
      const minP = minPrice ? Number(minPrice) : 0;
      const maxP = maxPrice ? Number(maxPrice) : Infinity;

      if (product.type === "variable") {
        product.variations = product.variations.filter(v => v.price >= minP && v.price <= maxP);
        if (product.variations.length === 0) {
          return res.status(404).json({ success: false, message: "No variations found within price range" });
        }
      } else if (product.type === "simple") {
        if (product.price < minP || product.price > maxP) {
          return res.status(404).json({ success: false, message: "Product does not match the price filter" });
        }
      }
    }

    if (product.type === "variable" && product.variations.length > 0) {
      const prices = product.variations.map(v => v.price);
      product.minPrice = Math.min(...prices);
      product.maxPrice = Math.max(...prices);
    } else if (product.type === "simple") {
      product.minPrice = product.price;
      product.maxPrice = product.price;
    }

    if (product.type === "variable") {
      product.variations = product.variations.map(v => ({
        name: v.name,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
        images: v.images,
        attributes: v.attributes.map(a => ({
          attribute: a.attribute
            ? { id: a.attribute._id, name: a.attribute.name, slug: a.attribute.slug, type: a.attribute.type }
            : null,
          value: a.value,
        })),
      }));
    }

    res.json({ success: true, product });
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
      brand,        // ✅ IDs only
      subbrand,     // ✅ IDs only
      isActive,
      isFeatured,
    } = req.body;

    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Defaults from existing doc
    let categoryId = product.category;
    let subcategoryId = product.subcategory;
    let brandId = product.brand;
    let subbrandId = product.subbrand;

    // ✅ category/subcategory by ID only
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ success: false, message: "Invalid parent category ID" });
      }
      const categoryDoc = await Category.findOne({ _id: category, parent: null });
      if (!categoryDoc) return res.status(400).json({ success: false, message: "Invalid parent category" });
      categoryId = categoryDoc._id;
    }

    if (subcategory) {
      if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({ success: false, message: "Invalid subcategory ID" });
      }
      const subcategoryDoc = await Category.findOne({ _id: subcategory, parent: categoryId });
      if (!subcategoryDoc) {
        return res.status(400).json({ success: false, message: "Invalid subcategory for given category" });
      }
      subcategoryId = subcategoryDoc._id;
    }

    // ✅ brand/subbrand by ID only
    if (brand) {
      if (!mongoose.Types.ObjectId.isValid(brand)) {
        return res.status(400).json({ success: false, message: "Invalid parent brand ID" });
      }
      const brandDoc = await Brand.findOne({ _id: brand, parent: null });
      if (!brandDoc) return res.status(400).json({ success: false, message: "Invalid parent brand" });
      brandId = brandDoc._id;
    }

    if (subbrand) {
      if (!mongoose.Types.ObjectId.isValid(subbrand)) {
        return res.status(400).json({ success: false, message: "Invalid subbrand ID" });
      }
      const subbrandDoc = await Brand.findOne({ _id: subbrand, parent: brandId });
      if (!subbrandDoc) {
        return res.status(400).json({ success: false, message: "Invalid subbrand for given brand" });
      }
      subbrandId = subbrandDoc._id;
    }

    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true });
    }
    if (description) product.description = description;
    if (type) product.type = type;

    // apply resolved refs
    if (categoryId) product.category = categoryId;
    if (subcategoryId !== undefined) product.subcategory = subcategoryId;
    if (brandId !== undefined) product.brand = brandId;          // ✅
    if (subbrandId !== undefined) product.subbrand = subbrandId;  // ✅

    if (type === "simple") {
      if (!price) return res.status(400).json({ success: false, message: "Price is required for simple product" });
      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ success: false, message: "At least one image is required for simple product" });
      }
      product.price = price;
      product.stock = stock || 0;
      product.images = images;
      product.variations = [];
    }

    if (type === "variable") {
      if (!Array.isArray(variations) || variations.length === 0) {
        return res.status(400).json({ success: false, message: "At least one variation is required for variable products" });
      }

      const processedVariations = [];
      for (const variation of variations) {
        if (!variation.name || !variation.price || !Array.isArray(variation.images) || variation.images.length === 0) {
          return res.status(400).json({ success: false, message: "Each variation must include name, price, and at least one image" });
        }

        const formattedAttributes = [];
        const attrEntries = Object.entries(variation.attributes || {});
        let attrId = null;
        console.log(attrEntries);
        for (const [key, item] of attrEntries) {
          const attrId = item?.attribute?.id;

          if (!attrId || !mongoose.Types.ObjectId.isValid(attrId)) {
            return res
              .status(400)
              .json({ success: false, message: `Invalid attribute ID: ${attrId}` });
          }

          const attrDoc = await Attribute.findById(attrId);
          if (!attrDoc) {
            return res
              .status(400)
              .json({ success: false, message: `Attribute not found: ${attrId}` });
          }

          formattedAttributes.push({
            attribute: attrDoc._id,
            value: item.value,
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
      .populate("brand", "name slug")            // ✅
      .populate("subbrand", "name slug parent")  // ✅
      .populate("variations.attributes.attribute", "name slug type");

    await delByPattern("cache:/api/public/products/new*");
    await delByPattern("cache:/api/public/products/sale*");
    await delByPattern("cache:/api/public/home*");

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

    await delByPattern("cache:/api/public/products/new*");
    await delByPattern("cache:/api/public/products/sale*");
    await delByPattern("cache:/api/public/home*");

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /products/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
