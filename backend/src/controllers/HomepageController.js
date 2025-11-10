const Banner = require("../models/Banner");
const Category = require("../models/Category");
const Product = require("../models/Product");
const SocialLink = require("../models/SocialLink");
const Testimonial = require("../models/Testimonial");

exports.getHomepageData = async (req, res) => {
  try {
    const [banners, categories, featuredProducts, testimonials, socialLinks] = await Promise.all([
      Banner.find({ isActive: true }).sort({ sequence: 1 }),
      Category.find({ parent: null }).select("name slug image parent"),
      Product.find({ isFeatured: true, isActive: true })
        .limit(4)
        .select("_id name slug price images variations category")
        .populate({ path: "category", select: "name slug" }),
      Testimonial.find({ isActive: true }).limit(5),
      SocialLink.find({ isActive: true }).sort({ sequence: 1 }),
    ]);
    res.json({
      success: true,
      data: { banners, categories, featuredProducts, testimonials, socialLinks },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
