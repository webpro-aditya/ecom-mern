const Category = require("../models/Category");
const { delByPattern } = require("../config/redis");

exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent, image } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    // Check for duplicate
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const newCategory = new Category({
      name,
      description,
      parent: parent || null,
      image: image || "",
    });

    await newCategory.save();

    await delByPattern("cache:/api/public/categories*");
    await delByPattern("cache:/api/public/home*");

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error in POST /categories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const search = req.query.search ? req.query.search.trim() : "";

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const totalCategories = await Category.countDocuments(filter);

    const categories = await Category.find(filter)
      .populate("parent", "name slug")
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      pagination: {
        total: totalCategories,
        page,
        limit,
        totalPages: Math.ceil(totalCategories / limit),
      },
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get Single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).populate(
      "parent",
      "name slug"
    );

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error in GET /categories/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// // Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent, image } = req.body;

    // Find the category
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Check duplicate name (if changed)
    if (name && name !== category.name) {
      const duplicate = await Category.findOne({ name });
      if (duplicate && duplicate._id.toString() !== id) {
        return res
          .status(400)
          .json({ success: false, message: "Category name already exists" });
      }
      category.name = name;
    }

    // Update other fields if provided
    if (description !== undefined) category.description = description;
    if (parent !== undefined) category.parent = parent || null;
    if (image !== undefined) category.image = image;

    // Slug will auto-update on save (see schema pre('validate'))
    await category.save();

    await delByPattern("cache:/api/public/categories*");
    await delByPattern("cache:/api/public/home*");

    const updatedCategory = await Category.findById(id).populate("parent", "name slug");

    res.json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error in PUT /categories/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// // Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Optional: check if this category has child categories
    const child = await Category.findOne({ parent: id });
    if (child) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with subcategories",
      });
    }

    await category.deleteOne();

    await delByPattern("cache:/api/public/categories*");
    await delByPattern("cache:/api/public/home*");

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /categories/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
