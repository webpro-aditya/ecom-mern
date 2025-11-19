const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");

exports.getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).select("name slug parent image").sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    console.error("Error in GET /public/categories:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 12);
    const products = await Product.find({ isActive: true })
      .select("name images price type createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, products });
  } catch (err) {
    console.error("Error in GET /public/products/new:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getSaleProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 12);
    const products = await Product.find({ isActive: true, isFeatured: true })
      .select("name images price type createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, products });
  } catch (err) {
    console.error("Error in GET /public/products/sale:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getFAQs = async (req, res) => {
  try {
    const faqs = [
      { q: "How do I track my order?", a: "Use the Track Order link in the header." },
      { q: "What is your return policy?", a: "30-day returns on most items." },
      { q: "How can I contact support?", a: "Email support@ecompro.com or call us." }
    ];
    res.json({ success: true, faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || "").toLowerCase();
    const pages = {
      "privacy-policy": {
        title: "Privacy Policy",
        html: "<p>We respect your privacy and protect your personal data.</p><p>We do not sell your information to third parties.</p>"
      },
      "terms-and-conditions": {
        title: "Terms & Conditions",
        html: "<p>Welcome to our terms. Use of the site implies acceptance.</p>"
      },
      "shipping-policy": {
        title: "Shipping Policy",
        html: "<p>We ship within 2-3 business days. Tracking provided.</p>"
      },
      "return-policy": {
        title: "Return Policy",
        html: "<p>30-day returns on most items. Conditions apply.</p>"
      }
    };
    const page = pages[slug];
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    res.json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getContactInfo = async (req, res) => {
  try {
    res.json({ success: true, contact: {
      email: "support@ecompro.com",
      phone: "+1 (555) 000-0000",
      address: "123 Commerce St, Suite 100, City, Country"
    }});
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getPublicProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const match = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const product = await Product.findOne({ ...match, isActive: true })
      .populate("category", "name slug")
      .populate("subcategory", "name slug parent")
      .populate("brand", "name slug")
      .populate("subbrand", "name slug parent")
      .populate("variations.attributes.attribute", "name slug type")
      .lean();
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    console.error("Error in GET /public/products/:id:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCategoryProducts = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const category = await Category.findOne({ slug }).lean();
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    const skip = (page - 1) * limit;
    const filter = { isActive: true, $or: [{ category: category._id }, { subcategory: category._id }] };
    const [products, total] = await Promise.all([
      Product.find(filter)
        .select("name images price type createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, page, totalPages: Math.ceil(total / limit), totalProducts: total, category, products });
  } catch (err) {
    console.error("Error in GET /public/category/:slug/products:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
