const mongoose = require("mongoose");

function error(res, list) {
  return res.status(400).json({ success: false, message: "Validation failed", errors: list });
}

function isEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isURL(v) {
  try {
    const u = new URL(v);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}

function isBool(v) { return typeof v === "boolean" || v === true || v === false; }
function isStr(v) { return typeof v === "string" && v.trim().length > 0; }
function isNum(v) { return typeof v === "number" && Number.isFinite(v); }
function isObjectId(v) { return typeof v === "string" && mongoose.Types.ObjectId.isValid(v); }

// Auth
exports.validateAuthRegister = (req, res, next) => {
  const { name, email, password, role } = req.body || {};
  const errs = [];
  if (!isStr(name)) errs.push({ field: "name", rule: "required" });
  if (!isEmail(email)) errs.push({ field: "email", rule: "email" });
  if (!isStr(password) || password.length < 8) errs.push({ field: "password", rule: "min:8" });
  if (role && !["admin", "vendor", "customer"].includes(String(role).toLowerCase())) {
    errs.push({ field: "role", rule: "enum:admin|vendor|customer" });
  }
  if (errs.length) return error(res, errs);
  next();
};

exports.validateAuthLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  const errs = [];
  if (!isEmail(email)) errs.push({ field: "email", rule: "email" });
  if (!isStr(password)) errs.push({ field: "password", rule: "required" });
  if (errs.length) return error(res, errs);
  next();
};

// Users
exports.validateUserCreate = (req, res, next) => {
  const { name, email, password, role } = req.body || {};
  const errs = [];
  if (!isStr(name)) errs.push({ field: "name", rule: "required" });
  if (!isEmail(email)) errs.push({ field: "email", rule: "email" });
  if (!isStr(password) || password.length < 8) errs.push({ field: "password", rule: "min:8" });
  if (role && !["admin", "vendor", "customer"].includes(String(role).toLowerCase())) {
    errs.push({ field: "role", rule: "enum:admin|vendor|customer" });
  }
  if (errs.length) return error(res, errs);
  next();
};

exports.validateUserUpdate = (req, res, next) => {
  const { name, email, password, role } = req.body || {};
  const errs = [];
  if (name !== undefined && !isStr(name)) errs.push({ field: "name", rule: "string" });
  if (email !== undefined && !isEmail(email)) errs.push({ field: "email", rule: "email" });
  if (password !== undefined && (!isStr(password) || password.length < 8)) errs.push({ field: "password", rule: "min:8" });
  if (role !== undefined && !["admin", "vendor", "customer"].includes(String(role).toLowerCase())) {
    errs.push({ field: "role", rule: "enum:admin|vendor|customer" });
  }
  if (!isObjectId(req.params.id || "")) errs.push({ field: "id", rule: "objectId" });
  if (errs.length) return error(res, errs);
  next();
};

// Brands
exports.validateBrandCreate = (req, res, next) => {
  const { name, logo, description, parent, isActive } = req.body || {};
  const errs = [];
  if (!isStr(name)) errs.push({ field: "name", rule: "required" });
  if (logo !== undefined && !isStr(logo)) errs.push({ field: "logo", rule: "string" });
  if (description !== undefined && !isStr(description)) errs.push({ field: "description", rule: "string" });
  if (parent !== undefined && !isObjectId(parent)) errs.push({ field: "parent", rule: "objectId" });
  if (isActive !== undefined && !isBool(isActive)) errs.push({ field: "isActive", rule: "boolean" });
  if (errs.length) return error(res, errs);
  next();
};

exports.validateBrandUpdate = (req, res, next) => {
  const { name, logo, description, parent, isActive } = req.body || {};
  const errs = [];
  if (!isObjectId(req.params.id || "")) errs.push({ field: "id", rule: "objectId" });
  if (name !== undefined && !isStr(name)) errs.push({ field: "name", rule: "string" });
  if (logo !== undefined && !isStr(logo)) errs.push({ field: "logo", rule: "string" });
  if (description !== undefined && !isStr(description)) errs.push({ field: "description", rule: "string" });
  if (parent !== undefined && !isObjectId(parent)) errs.push({ field: "parent", rule: "objectId" });
  if (isActive !== undefined && !isBool(isActive)) errs.push({ field: "isActive", rule: "boolean" });
  if (errs.length) return error(res, errs);
  next();
};

// Social Links
exports.validateSocialLinkCreate = (req, res, next) => {
  const { platform, url, icon, sequence, isActive } = req.body || {};
  const errs = [];
  if (!isStr(platform)) errs.push({ field: "platform", rule: "required" });
  if (!isURL(url)) errs.push({ field: "url", rule: "url" });
  if (icon !== undefined && !isStr(icon)) errs.push({ field: "icon", rule: "string" });
  if (sequence !== undefined && !isNum(sequence)) errs.push({ field: "sequence", rule: "number" });
  if (isActive !== undefined && !isBool(isActive)) errs.push({ field: "isActive", rule: "boolean" });
  if (errs.length) return error(res, errs);
  next();
};

exports.validateSocialLinkUpdate = (req, res, next) => {
  const { platform, url, icon, sequence, isActive } = req.body || {};
  const errs = [];
  if (!isObjectId(req.params.id || "")) errs.push({ field: "id", rule: "objectId" });
  if (platform !== undefined && !isStr(platform)) errs.push({ field: "platform", rule: "string" });
  if (url !== undefined && !isURL(url)) errs.push({ field: "url", rule: "url" });
  if (icon !== undefined && !isStr(icon)) errs.push({ field: "icon", rule: "string" });
  if (sequence !== undefined && !isNum(sequence)) errs.push({ field: "sequence", rule: "number" });
  if (isActive !== undefined && !isBool(isActive)) errs.push({ field: "isActive", rule: "boolean" });
  if (errs.length) return error(res, errs);
  next();
};

// Menus
exports.validateMenuCreate = (req, res, next) => {
  const { title, link, icon, parent, sequence, isActive } = req.body || {};
  const errs = [];
  if (!isStr(title)) errs.push({ field: "title", rule: "required" });
  if (!isURL(link)) errs.push({ field: "link", rule: "url" });
  if (icon !== undefined && !isStr(icon)) errs.push({ field: "icon", rule: "string" });
  if (parent !== undefined && !isObjectId(parent)) errs.push({ field: "parent", rule: "objectId" });
  if (sequence !== undefined && !isNum(sequence)) errs.push({ field: "sequence", rule: "number" });
  if (isActive !== undefined && !isBool(isActive)) errs.push({ field: "isActive", rule: "boolean" });
  if (errs.length) return error(res, errs);
  next();
};

exports.validateMenuUpdate = (req, res, next) => {
  const { title, link, icon, parent, sequence, isActive } = req.body || {};
  const errs = [];
  if (!isObjectId(req.params.id || "")) errs.push({ field: "id", rule: "objectId" });
  if (title === undefined || link === undefined || icon === undefined || sequence === undefined || isActive === undefined) {
    errs.push({ field: "*", rule: "all-required" });
  } else {
    if (!isStr(title)) errs.push({ field: "title", rule: "string" });
    if (!isURL(link)) errs.push({ field: "link", rule: "url" });
    if (!isStr(icon)) errs.push({ field: "icon", rule: "string" });
    if (!isNum(sequence)) errs.push({ field: "sequence", rule: "number" });
    if (!isBool(isActive)) errs.push({ field: "isActive", rule: "boolean" });
    if (parent !== undefined && !isObjectId(parent)) errs.push({ field: "parent", rule: "objectId" });
  }
  if (errs.length) return error(res, errs);
  next();
};

// Testimonials
exports.validateTestimonialCreate = (req, res, next) => {
  const { name, image, text, rating, verifiedPurchase, designation, isActive, sequence } = req.body || {};
  const errs = [];
  if (!isStr(name)) errs.push({ field: "name", rule: "required" });
  if (!isStr(text)) errs.push({ field: "text", rule: "required" });
  if (!isNum(rating)) errs.push({ field: "rating", rule: "number" });
  if (image !== undefined && !isStr(image)) errs.push({ field: "image", rule: "string" });
  if (verifiedPurchase !== undefined && !isBool(verifiedPurchase)) errs.push({ field: "verifiedPurchase", rule: "boolean" });
  if (designation !== undefined && !isStr(designation)) errs.push({ field: "designation", rule: "string" });
  if (isActive !== undefined && !isBool(isActive)) errs.push({ field: "isActive", rule: "boolean" });
  if (sequence !== undefined && !isNum(sequence)) errs.push({ field: "sequence", rule: "number" });
  if (errs.length) return error(res, errs);
  next();
};

exports.validateTestimonialUpdate = (req, res, next) => {
  const { name, image, text, rating, verifiedPurchase, designation, isActive, sequence } = req.body || {};
  const errs = [];
  if (!isObjectId(req.params.id || "")) errs.push({ field: "id", rule: "objectId" });
  const fields = [name, image, text, rating, verifiedPurchase, designation, isActive, sequence];
  if (fields.some((v) => v === undefined)) errs.push({ field: "*", rule: "all-required" });
  if (name !== undefined && !isStr(name)) errs.push({ field: "name", rule: "string" });
  if (image !== undefined && !isStr(image)) errs.push({ field: "image", rule: "string" });
  if (text !== undefined && !isStr(text)) errs.push({ field: "text", rule: "string" });
  if (rating !== undefined && !isNum(rating)) errs.push({ field: "rating", rule: "number" });
  if (verifiedPurchase !== undefined && !isBool(verifiedPurchase)) errs.push({ field: "verifiedPurchase", rule: "boolean" });
  if (designation !== undefined && !isStr(designation)) errs.push({ field: "designation", rule: "string" });
  if (isActive !== undefined && !isBool(isActive)) errs.push({ field: "isActive", rule: "boolean" });
  if (sequence !== undefined && !isNum(sequence)) errs.push({ field: "sequence", rule: "number" });
  if (errs.length) return error(res, errs);
  next();
};

