const SocialLink = require("../models/SocialLink");
const mongoose = require("mongoose");
const slugify = require("slugify");
const { delByPattern } = require("../config/redis");

// ✅ Create a Social Link
exports.createSocialLink = async (req, res) => {
  try {
    const { platform, url, icon, sequence, isActive } = req.body;

    if (!platform || !url) {
      return res.status(400).json({
        success: false,
        message: "Platform name and URL are required.",
      });
    }

    const slug = slugify(platform, { lower: true, strict: true });

    const socialLink = new SocialLink({
      platform,
      slug,
      url,
      icon,
      sequence,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    const savedLink = await socialLink.save();

    await delByPattern("cache:/api/public/home*");

    res.status(201).json({
      success: true,
      message: "Social link created successfully",
      data: savedLink,
    });
  } catch (error) {
    console.error("Error in POST /social-link/create:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      const value = error.keyValue?.[field];
      return res.status(400).json({
        success: false,
        message: `A social link with the same ${field} ('${value}') already exists.`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating social link",
    });
  }
};

// ✅ Get all Social Links
exports.getAllSocialLinks = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const links = await SocialLink.find(filter).sort({ sequence: 1, createdAt: -1 });

    res.json({
      success: true,
      total: links.length,
      data: links,
    });
  } catch (error) {
    console.error("Error in GET /social-links:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Social Link by ID or Slug
exports.getSocialLinkById = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await SocialLink.findOne(
      mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id }
    );

    if (!link) {
      return res.status(404).json({ success: false, message: "Social link not found" });
    }

    res.json({ success: true, data: link });
  } catch (error) {
    console.error("Error in GET /social-link/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update Social Link
exports.updateSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, url, icon, sequence, isActive } = req.body;

    const link = await SocialLink.findById(id);
    if (!link) {
      return res.status(404).json({ success: false, message: "Social link not found" });
    }

    if (platform) {
      link.platform = platform;
      link.slug = slugify(platform, { lower: true, strict: true });
    }
    if (url) link.url = url;
    if (icon !== undefined) link.icon = icon;
    if (sequence !== undefined) link.sequence = sequence;
    if (isActive !== undefined) link.isActive = isActive;

    const updatedLink = await link.save();

    await delByPattern("cache:/api/public/home*");

    res.json({
      success: true,
      message: "Social link updated successfully",
      data: updatedLink,
    });
  } catch (error) {
    console.error("Error in PUT /social-link/update/:id:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      const value = error.keyValue?.[field];
      return res.status(400).json({
        success: false,
        message: `A social link with the same ${field} ('${value}') already exists.`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating social link",
    });
  }
};

// ✅ Delete Social Link
exports.deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await SocialLink.findById(id);
    if (!link) {
      return res.status(404).json({ success: false, message: "Social link not found" });
    }

    await link.deleteOne();

    await delByPattern("cache:/api/public/home*");

    res.json({ success: true, message: "Social link deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /social-link/delete/:id:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
