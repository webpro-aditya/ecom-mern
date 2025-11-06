const Menu = require("../models/Menu");

// Create Menu (works for both main and sub items)
exports.createMenu = async (req, res) => {
  try {
    const { title, link, icon, parent, sequence, isActive } = req.body;

    if (!title || !link) {
      return res.status(400).json({
        success: false,
        message: "Title and link are required."
      });
    }

    // If parent is provided, validate it exists
    if (parent) {
      const parentMenu = await Menu.findById(parent);
      if (!parentMenu) {
        return res.status(400).json({
          success: false,
          message: "Invalid parent menu ID."
        });
      }
    }

    const newMenu = new Menu({
      title,
      link,
      icon,
      parent: parent || null,
      sequence,
      isActive
    });

    await newMenu.save();
    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: newMenu
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all menus (nested structure)
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().sort({ sequence: 1 });

    // Build hierarchical tree
    const menuTree = menus
      .filter(m => !m.parent)
      .map(main => ({
        ...main.toObject(),
        children: menus.filter(sub => sub.parent?.toString() === main._id.toString())
      }));

    res.status(200).json({
      success: true,
      count: menus.length,
      data: menuTree
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get menu by ID
exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Menu (all fields required)
exports.updateMenu = async (req, res) => {
  try {
    const { title, link, icon, parent, sequence, isActive } = req.body;

    // All required
    if (
      title === undefined ||
      link === undefined ||
      icon === undefined ||
      sequence === undefined ||
      isActive === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, link, icon, sequence, isActive) are required."
      });
    }

    // Validate parent
    if (parent) {
      const parentMenu = await Menu.findById(parent);
      if (!parentMenu) {
        return res.status(400).json({ success: false, message: "Invalid parent menu ID." });
      }
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      { title, link, icon, parent: parent || null, sequence, isActive },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      data: updatedMenu
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete menu
exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    // Delete its submenus too
    await Menu.deleteMany({ parent: menu._id });
    await menu.deleteOne();

    res.status(200).json({ success: true, message: "Menu and its sub-items deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
