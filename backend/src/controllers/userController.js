const bcrypt = require("bcrypt");
const User = require("../models/User");

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    // Query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt"; // can be: name, email, role, etc.
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const search = req.query.search ? req.query.search.trim() : "";

    const filter = {};

    // Search filter (by name or email)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination metadata
    const totalUsers = await User.countDocuments(filter);

    // Fetch paginated + sorted users
    const users = await User.find(filter)
      .select("-password")
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, email, and password are required",
        });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const validRoles = ["admin", "vendor", "customer"];
    const assignedRole = validRoles.includes((role || "").toLowerCase())
      ? role.toLowerCase()
      : "customer";

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    // Validate and assign role
    const validRoles = ["admin", "vendor", "customer"];
    if (role) {
      user.role = validRoles.includes(role.toLowerCase())
        ? role.toLowerCase()
        : "customer";
    }

    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
