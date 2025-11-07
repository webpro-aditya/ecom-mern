const Brand = require("../models/Brand");
const mongoose = require("mongoose");
const slugify = require("slugify");

// ✅ Create Brand or Subbrand
exports.createBrand = async (req, res) => {
  try {
    const { name, logo, description, parent, isActive } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Brand name is required" });
    }

    let parentBrand = null;

    if (parent) {
      if (!mongoose.Types.ObjectId.isValid(parent)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid parent brand ID" });
      }

      parentBrand = await Brand.findById(parent);
      if (!parentBrand) {
        return res
          .status(400)
          .json({ success: false, message: "Parent brand not found" });
      }
    }

    const slug = slugify(name, { lower: true, strict: true });

    const brand = new Brand({
      name,
      slug,
      logo,
      description,
      parent: parentBrand ? parentBrand._id : null,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    const savedBrand = await brand.save();

    res.status(201).json({
      success: true,
      message: parent
        ? "Subbrand created successfully"
        : "Brand created successfully",
      data: savedBrand,
    });
  } catch (error) {
    console.error("Error in POST /brands/create:", error);

    // ✅ Handle duplicate key error (Mongo error code 11000)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue || {})[0];
      const duplicateValue = error.keyValue?.[duplicateField];
      return res.status(400).json({
        success: false,
        message: `A brand with the same ${duplicateField} ('${duplicateValue}') already exists.`,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating brand",
    });
  }
};


// ✅ Get All Brands (with nested subbrands)
exports.getAllBrands = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Search
    const search = req.query.search ? req.query.search.trim() : "";

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Get all brands (since we need them to build hierarchy)
    const allBrands = await Brand.find(filter)
      .sort({ [sortBy]: sortOrder })
      .lean();

    // Count for pagination
    const totalBrands = allBrands.length;

    // Build brand tree (main + subbrands)
    const mainBrands = allBrands.filter((b) => !b.parent);
    const brandTree = mainBrands.map((main) => ({
      ...main,
      subbrands: allBrands.filter(
        (sub) => sub.parent?.toString() === main._id.toString()
      ),
    }));

    // Pagination slice (apply after hierarchy built)
    const paginatedBrands = brandTree.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      pagination: {
        total: totalBrands,
        page,
        limit,
        totalPages: Math.ceil(totalBrands / limit),
      },
      data: paginatedBrands,
    });
  } catch (error) {
    console.error("Error in GET /brands:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Brand by ID or Slug
exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findOne(
      mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id }
    )
      .populate("parent", "name slug")
      .lean();

    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    res.json({ success: true, data: brand });
  } catch (error) {
    console.error("Error in GET /brands/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update Brand
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, description, parent, isActive } = req.body;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    if (name) {
      brand.name = name;
      brand.slug = slugify(name, { lower: true, strict: true });
    }

    if (logo !== undefined) brand.logo = logo;
    if (description !== undefined) brand.description = description;
    if (isActive !== undefined) brand.isActive = isActive;

    if (parent) {
      if (!mongoose.Types.ObjectId.isValid(parent)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid parent brand ID" });
      }
      const parentBrand = await Brand.findById(parent);
      if (!parentBrand) {
        return res
          .status(400)
          .json({ success: false, message: "Parent brand not found" });
      }
      brand.parent = parentBrand._id;
    } else {
      brand.parent = null;
    }

    const updatedBrand = await brand.save();

    res.json({
      success: true,
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    console.error("Error in PUT /brands/:id:", error);

    // ✅ Handle duplicate name/slug error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue || {})[0];
      const duplicateValue = error.keyValue?.[duplicateField];
      return res.status(400).json({
        success: false,
        message: `A brand with the same ${duplicateField} ('${duplicateValue}') already exists.`,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error while updating brand",
    });
  }
};


// ✅ Delete Brand (and its subbrands)
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    // Delete subbrands too
    await Brand.deleteMany({ parent: brand._id });
    await brand.deleteOne();

    res.json({ success: true, message: "Brand and its subbrands deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /brands/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
