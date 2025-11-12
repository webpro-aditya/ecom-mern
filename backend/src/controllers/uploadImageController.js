// controllers/uploadController.js
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    const invalid = req.files.find((f) => !allowed.includes(f.mimetype));
    if (invalid) {
      return res.status(400).json({ success: false, message: "Invalid file type" });
    }

    const filePaths = req.files.map((file) =>
      file.path.replace(/\\/g, "/").replace(/^.*public\//, "")
    );

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      paths: filePaths,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "File upload failed",
    });
  }
};
