import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: { type: String },

  // 🔹 Additional LinkedIn-style fields
  headline: { type: String, default: "" }, // e.g. "Frontend Developer at XYZ"
  location: { type: String, default: "" }, // e.g. "San Francisco, USA"
  profileImage: { type: String, default: "" }, // URL of profile pic
  coverImage: { type: String, default: "" }, // URL of cover image

 
  experience: [
    {
      company: String,
      role: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],
  education: [
    {
      school: String,
      degree: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],
  skills: [String]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
