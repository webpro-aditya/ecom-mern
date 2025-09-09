const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    // Check duplicate
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const newCategory = new Category({
      name,
      description,
      parent: parent || null
      // no need to pass slug, schema will handle it
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory
    });
  } catch (error) {
    console.error("Error in POST /categories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("parent", "name slug");

    res.json({
      success: true,
      total: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Error in GET /categories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).populate("parent", "name slug");

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
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
    const { name, description, parent } = req.body;

    // Build update object
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (description !== undefined) updateData.description = description;
    if (parent !== undefined) updateData.parent = parent;

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("parent", "name slug");

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

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
      return res.status(404).json({ success: false, message: "Category not found" });
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

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /categories/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};