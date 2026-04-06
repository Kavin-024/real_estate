const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerSeller,
  loginSeller,
  logoutSeller,
  refreshAccessToken,
} = require("../controllers/authController");

const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .isMobilePhone("en-IN").withMessage("Enter a valid Indian mobile number")
    .isLength({ min: 10, max: 10 }).withMessage("Phone must be 10 digits"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/).withMessage("Password must have at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must have at least one number"),
];

const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

router.post("/register", registerRules, registerSeller);
router.post("/login", loginRules, loginSeller);
router.post("/logout", logoutSeller);
router.post("/refresh", refreshAccessToken);

module.exports = router;