const Seller = require("../models/Seller");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// @route POST /api/auth/register
const registerSeller = async (req, res) => {
  console.log("REGISTER HIT - body:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("VALIDATION ERRORS:", errors.array());
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => e.msg),
    });
  }

  const { name, email, phone, password } = req.body;
  console.log("VALIDATION PASSED - creating seller:", email);

  try {
    const existing = await Seller.findOne({ email });
    console.log("EXISTING CHECK DONE:", existing ? "found" : "not found");

    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const seller = await Seller.create({ name, email, phone, password });
    console.log("SELLER CREATED:", seller._id);

    res.status(201).json({
      message: "Seller registered successfully",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        
      },
    });
  } catch (error) {
    console.error("REGISTER CRASH:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};
// @route POST /api/auth/login
const loginSeller = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => e.msg),
    });
  }

  const { email, password } = req.body;

  try {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await seller.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(seller._id);
    const refreshToken = generateRefreshToken(seller._id);

    seller.refreshToken = refreshToken;
    await seller.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        isAdmin: seller.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @route POST /api/auth/logout
const logoutSeller = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(204).json({ message: "No token" });

  try {
    const seller = await Seller.findOne({ refreshToken: token });
    if (seller) {
      seller.refreshToken = null;
      await seller.save();
    }

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

// @route POST /api/auth/refresh
const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const seller = await Seller.findById(decoded.id);

    if (!seller || seller.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(seller._id);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};

module.exports = { registerSeller, loginSeller, logoutSeller, refreshAccessToken };