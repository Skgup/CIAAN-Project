import { useState } from "react";
import { registerUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", bio: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
        console.log("something went wrong "+ err);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* LinkedIn Branding */}
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">Join LinkedIn Clone</h1>
        <p className="text-center text-gray-500 mb-6">Make the most of your professional life.</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <textarea
            name="bio"
            placeholder="Your bio..."
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Agree & Join
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
