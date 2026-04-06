const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const Seller = require("../models/Seller");
const Property = require("../models/Property");

// Every route here uses: protect → adminOnly (both required, in this order)

// Get all sellers
router.get("/sellers", protect, adminOnly, async (req, res) => {
  try {
    const sellers = await Seller.find().select("-password -refreshToken");
    res.json({ sellers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sellers" });
  }
});

// Delete a seller
router.delete("/sellers/:id", protect, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.seller._id.toString()) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }
    await Seller.findByIdAndDelete(req.params.id);
    await Property.deleteMany({ seller: req.params.id }); // clean up their listings too
    res.json({ message: "Seller deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete seller" });
  }
});

// Get all properties (including unavailable)
router.get("/properties", protect, adminOnly, async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("seller", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ properties });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

// Delete any property
router.delete("/properties/:id", protect, adminOnly, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete property" });
  }
});

module.exports = router;