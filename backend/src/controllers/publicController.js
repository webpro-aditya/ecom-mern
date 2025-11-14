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
