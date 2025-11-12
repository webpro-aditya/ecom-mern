const Banner = require("../models/Banner");

function sanitizeHtmlServer(input = "") {
  try {
    let out = String(input);
    out = out.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "");
    out = out.replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "");
    out = out.replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, "");
    out = out.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    out = out.replace(/\s(href|src)\s*=\s*("|')\s*javascript:[^"']*("|')/gi, "");
    return out;
  } catch (_) {
    return "";
  }
}

// Create Banner
exports.createBanner = async (req, res) => {
  try {
    const { title, image, htmlContent, redirectUrl, isActive, startDate, endDate } = req.body;

    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: "Title and image are required fields",
      });
    }

    const lastBanner = await Banner.findOne().sort({ sequence: -1 });

    const nextSequence = lastBanner ? lastBanner.sequence + 1 : 1;

    const newBanner = new Banner({
      title: title.trim(),
      image,
      htmlContent: sanitizeHtmlServer(htmlContent || ""),
      sequence: nextSequence,
      redirectUrl: redirectUrl || "",
      isActive: typeof isActive === "boolean" ? isActive : true,
      startDate,
      endDate,
    });

    await newBanner.save();

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: newBanner,
    });
  } catch (err) {
    console.error("Error in createBanner:", err);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to create banner.",
    });
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
        htmlContent: sanitizeHtmlServer(htmlContent || ""),
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

// Update Sequence - drag drop
exports.updateBannerSequences = async (req, res) => {
  try {
    const { sequences } = req.body;
    if (!Array.isArray(sequences) || sequences.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid sequence data" });
    }

    // sequences: [{ _id, sequence }, ...]
    const bulkOps = sequences.map((b) => ({
      updateOne: {
        filter: { _id: b._id },
        update: { $set: { sequence: b.sequence } },
      },
    }));

    await Banner.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: "Banner sequences updated successfully",
    });
  } catch (err) {
    console.error("Sequence update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

