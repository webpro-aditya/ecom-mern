const Testimonial = require("../models/Testimonial");
const { delByPattern } = require("../config/redis");

// Create Testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, image, text, rating, verifiedPurchase, designation, isActive, sequence } = req.body;

    // Validation
    if (!name || !text || !rating) {
      return res.status(400).json({
        success: false,
        message: "Name, text, and rating are required."
      });
    }

    const newTestimonial = new Testimonial({
      name,
      image,
      text,
      rating,
      verifiedPurchase,
      designation,
      isActive,
      sequence
    });

    await newTestimonial.save();

    await delByPattern("cache:/api/public/home*");

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: newTestimonial
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get All Testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ sequence: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    res.status(200).json({ success: true, data: testimonial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Testimonial (all fields required)
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, image, text, rating, verifiedPurchase, designation, isActive, sequence } = req.body;

    if (
      name === undefined ||
      image === undefined ||
      text === undefined ||
      rating === undefined ||
      verifiedPurchase === undefined ||
      designation === undefined ||
      isActive === undefined ||
      sequence === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, image, text, rating, verifiedPurchase, designation, isActive, sequence) are required."
      });
    }

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        name,
        image,
        text,
        rating,
        verifiedPurchase,
        designation,
        isActive,
        sequence
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    await delByPattern("cache:/api/public/home*");

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: updated
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete Testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    await delByPattern("cache:/api/public/home*");

    res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
