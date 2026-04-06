const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const {
  createProperty,
  getMyProperties,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

const propertyRules = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 5 }).withMessage("Title must be at least 5 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

  body("landType")
    .notEmpty().withMessage("Land type is required")
    .isIn(["agricultural", "residential", "commercial", "industrial"])
    .withMessage("Invalid land type"),

  body("area.value")
    .notEmpty().withMessage("Area value is required")
    .isNumeric().withMessage("Area must be a number")
    .custom((v) => v > 0).withMessage("Area must be greater than 0"),

  body("area.unit")
    .notEmpty().withMessage("Area unit is required")
    .isIn(["cents", "acres", "sqft"]).withMessage("Invalid area unit"),

  body("location.address")
    .trim()
    .notEmpty().withMessage("Address is required"),

  body("location.district")
    .trim()
    .notEmpty().withMessage("District is required"),

  body("location.pincode")
    .trim()
    .notEmpty().withMessage("Pincode is required")
    .isLength({ min: 6, max: 6 }).withMessage("Pincode must be 6 digits")
    .isNumeric().withMessage("Pincode must contain only numbers"),

  body("price.total")
    .notEmpty().withMessage("Total price is required")
    .isNumeric().withMessage("Price must be a number")
    .custom((v) => v > 0).withMessage("Price must be greater than 0"),
];

// Public routes
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

// Private routes (seller must be logged in)
router.post("/", protect, propertyRules, createProperty);
router.get("/my/listings", protect, getMyProperties);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

module.exports = router;