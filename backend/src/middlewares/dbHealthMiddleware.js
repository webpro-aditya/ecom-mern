const mongoose = require("mongoose");

module.exports = function dbHealthMiddleware(req, res, next) {
  const ready = mongoose.connection.readyState === 1;
  if (!ready) return res.status(503).json({ message: "Database unavailable" });
  next();
};
