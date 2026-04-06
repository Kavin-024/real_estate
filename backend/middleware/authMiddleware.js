const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.seller = await Seller.findById(decoded.id).select("-password -refreshToken");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token expired or invalid" });
  }
};

module.exports = { protect };