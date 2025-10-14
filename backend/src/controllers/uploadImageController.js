// controllers/uploadController.js
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
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
