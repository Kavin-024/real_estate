const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    landType: {
      type: String,
      enum: ["agricultural", "residential", "commercial", "industrial"],
      required: [true, "Land type is required"],
    },
    area: {
      value: {
        type: Number,
        required: [true, "Area value is required"],
      },
      unit: {
        type: String,
        enum: ["cents", "acres", "sqft"],
        default: "cents",
      },
    },
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
      village: { type: String, trim: true },
      taluk: { type: String, trim: true },
      district: {
        type: String,
        required: [true, "District is required"],
        trim: true,
      },
      state: { type: String, default: "Tamil Nadu", trim: true },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
        trim: true,
      },
    },
    price: {
      total: {
        type: Number,
        required: [true, "Total price is required"],
      },
      perUnit: { type: Number },
      isNegotiable: { type: Boolean, default: false },
    },
    features: {
      waterSource: {
        type: String,
        enum: ["borewell", "canal", "rain-fed", "none"],
        default: "none",
      },
      electricity: { type: Boolean, default: false },
      roadAccess: { type: Boolean, default: false },
      soilType: { type: String, trim: true },
    },
    surveyNumber: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);