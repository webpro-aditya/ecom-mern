const Product = require("../models/Product");
const Category = require("../models/Category");

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("userId", "name email")
      .populate("catId", "name description")
      .select("-__v");

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new Product
exports.createProduct = async (req, res) => {
  try {
    const { name, catId, price, qty, description } = req.body;
    const sku = generateSKU(name);
    const userId = req.user.id;

    if (!name || !catId || !price || !qty) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const category = await Category.findById(catId);
    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const newProduct = new Product({
      name,
      sku,
      userId,
      catId,
      price,
      qty,
      description,
      usedQty: 0,
      remQty: qty,
      status: 1,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Retrieve a Product by Id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("catId", "name");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error in getProductById:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update a Product
exports.updateProduct = async (req, res) => {
    try {
        const { name, catId, price, qty, description, status } = req.body;

        // Find and update product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, catId, price, qty, description, status },
            { new: true } // Return updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Utility Functions
const generateSKU = (productName) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
    const shortName = productName.substring(0, 3).toUpperCase(); // First 3 letters (uppercase)

    return `${shortName}-${randomNum}-${timestamp}`;
};


