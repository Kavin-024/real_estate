const Property = require("../models/Property");
const { validationResult } = require("express-validator");
const { sendNewPropertyEmail } = require("../utils/sendEmail");

// @route  POST /api/properties
// @access Private (seller only)
const createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => e.msg),
    });
  }

  try {
    const property = await Property.create({
      seller: req.seller._id,
      ...req.body,
    });

    // Send email notification to admin
    // We use try/catch separately so email failure doesn't fail the whole request
    try {
      await sendNewPropertyEmail({
        sellerName: req.seller.name,
        sellerEmail: req.seller.email,
        sellerPhone: req.seller.phone,
        propertyTitle: property.title,
        propertyLocation: `${property.location.district}, ${property.location.state}`,
        propertyPrice: property.price.total,
        propertyType: property.landType,
        propertyId: property._id,
      });
    } catch (emailError) {
      // Email failed but property was created — just log it, don't crash
      console.error("Email notification failed:", emailError.message);
    }

    res.status(201).json({
      message: "Property listed successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create property",
      error: error.message,
    });
  }
};


// @route  GET /api/properties/my
// @access Private (seller only — their own listings)
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ seller: req.seller._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Properties fetched successfully",
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};

// @route  GET /api/properties
// @access Public (buyers can see all listings)
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isAvailable: true })
      .populate("seller", "name phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Properties fetched successfully",
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};

// @route  GET /api/properties/:id
// @access Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "seller",
      "name phone email"
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ property });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch property",
      error: error.message,
    });
  }
};

// @route  PUT /api/properties/:id
// @access Private (only the seller who posted it)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Make sure the logged in seller owns this property
    if (property.seller.toString() !== req.seller._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Property updated successfully",
      property: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update property",
      error: error.message,
    });
  }
};

// @route  DELETE /api/properties/:id
// @access Private (only the seller who posted it)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Make sure the logged in seller owns this property
    if (property.seller.toString() !== req.seller._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this property" });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete property",
      error: error.message,
    });
  }
};

module.exports = {
  createProperty,
  getMyProperties,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};