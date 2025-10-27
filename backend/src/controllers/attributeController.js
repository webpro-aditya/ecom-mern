const mongoose = require("mongoose");
const Attribute = require("../models/Attribute");

// Create new attribute
exports.createAttribute = async (req, res) => {
  try {
    const { name, options, type } = req.body;

    if (!name) return res.status(400).json({ success: false, message: "Name is required" });

    const exists = await Attribute.findOne({ name });
    if (exists) return res.status(400).json({ success: false, message: "Attribute already exists" });

    const attribute = await Attribute.create({
      name,
      options: Array.isArray(options) ? options : [],
      type: type || "select",
    });

    res.status(201).json({ success: true, attribute });
  } catch (error) {
    console.error("Error creating attribute:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all attributes
exports.getAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, attributes });
  } catch (error) {
    console.error("Error fetching attributes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single attribute by ID or slug
exports.getAttributeById = async (req, res) => {
  try {
    const { id } = req.params;
    const attribute = await Attribute.findOne(
      mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id }
    );

    if (!attribute)
      return res.status(404).json({ success: false, message: "Attribute not found" });

    res.status(200).json({ success: true, attribute });
  } catch (error) {
    console.error("Error fetching attribute:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update attribute
exports.updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, options, type } = req.body;

    const attribute = await Attribute.findById(id);
    if (!attribute)
      return res.status(404).json({ success: false, message: "Attribute not found" });

    if (name) attribute.name = name;
    if (options) attribute.options = Array.isArray(options) ? options : [];
    if (type) attribute.type = type;

    await attribute.save();
    res.status(200).json({ success: true, attribute });
  } catch (error) {
    console.error("Error updating attribute:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete attribute
exports.deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Attribute.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Attribute not found" });

    res.status(200).json({ success: true, message: "Attribute deleted successfully" });
  } catch (error) {
    console.error("Error deleting attribute:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
