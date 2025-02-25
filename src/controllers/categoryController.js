const Category = require("../models/Category");

// Create Category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const newCategory = new Category({
            name,
            description
        });

        await newCategory.save();
        res.status(201).json({ message: "Category created successfully", category: newCategory });

    } catch (error) {
        console.error("Error in createCategory:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get All Categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().select("-__v");
        res.json(categories);
    } catch (error) {
        console.error("Error in getCategories:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get Single Category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        console.error("Error in getCategoryById:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Find and update category
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true } // Return updated category
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        console.error("Error in updateCategory:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error in deleteCategory:", error);
        res.status(500).json({ message: "Server error" });
    }
};
