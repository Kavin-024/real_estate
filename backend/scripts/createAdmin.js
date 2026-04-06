const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Seller = require("../models/Seller");

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Seller.findOne({ email: "admin@realestate.com" });
  if (existing) {
    console.log("Admin already exists.");
    process.exit();
  }

  await Seller.create({
    name: "Admin",
    email: "admin@realestate.com",
    phone: "9999999999",
    password: "Admin@123",  // bcrypt pre-save hook hashes this automatically
    isAdmin: true,
  });

  console.log("✅ Admin created: admin@realestate.com / Admin@123");
  process.exit();
};

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});