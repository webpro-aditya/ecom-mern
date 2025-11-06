const Banner = require("../models/Banner");

// Create Banner
exports.createBanner = async (req, res) => {
  try {
    const { title, image, htmlContent, sequence, redirectUrl, isActive, startDate, endDate } = req.body;

    const newBanner = new Banner({
      title,
      image,
      htmlContent,
      sequence,
      redirectUrl,
      isActive,
      startDate,
      endDate
    });

    await newBanner.save();
    res.status(201).json({ success: true, message: "Banner created successfully", data: newBanner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get All Banners
exports.getAllUBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ sequence: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, data: banner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Banner
exports.updateBanner = async (req, res) => {
  try {
    const { title, image, htmlContent, sequence, redirectUrl, isActive, startDate, endDate } = req.body;

    // Require all key fields
    if (
      title === undefined ||
      image === undefined ||
      htmlContent === undefined ||
      sequence === undefined ||
      redirectUrl === undefined ||
      isActive === undefined ||
      startDate === undefined ||
      endDate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, image, htmlContent, sequence, redirectUrl, isActive, startDate, endDate) are required for update."
      });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        title,
        image,
        htmlContent,
        sequence,
        redirectUrl,
        isActive,
        startDate,
        endDate
      },
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBanner
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
