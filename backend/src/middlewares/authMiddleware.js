const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/BlacklistToken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies && req.cookies.token;
  const headerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // check blacklist
    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token has been invalidated" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    return res.status(401).json({ message: "Logged Out" });
  }
};

module.exports = authMiddleware;
