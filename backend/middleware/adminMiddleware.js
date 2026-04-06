const adminOnly = (req, res, next) => {
  // Runs AFTER protect middleware, so req.seller is already set
  if (!req.seller || !req.seller.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { adminOnly };