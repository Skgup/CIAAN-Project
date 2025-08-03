import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, bio });

    res.status(201).json(user);
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE PROFILE (Supports all fields)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      name, bio, headline, location,
      profileImage, coverImage,
      skills, experience, education
    } = req.body;

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (headline !== undefined) user.headline = headline;
    if (location !== undefined) user.location = location;

    if (profileImage !== undefined) user.profileImage = profileImage;
    if (coverImage !== undefined) user.coverImage = coverImage;

    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
    }

    if (experience !== undefined) user.experience = experience;
    if (education !== undefined) user.education = education;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("❌ Profile Update Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("❌ Get Profile Error:", err);
    res.status(500).json({ error: err.message });
  }
};
