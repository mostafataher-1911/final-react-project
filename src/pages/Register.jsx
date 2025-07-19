import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: formData.username,
        email: formData.email,
        createdAt: new Date(),
      });

      toast.success("Registration successful ");
      navigate("/login");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email already in use ");
      } else {
        toast.error("Something went wrong ...");
        console.error(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white text-black p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${errors.username ? "border-red-500" : "border-gray-300"}`}
            required
          />
          {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${errors.email ? "border-red-500" : "border-gray-300"}`}
            required
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${errors.password ? "border-red-500" : "border-gray-300"}`}
            required
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
            required
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
        >
          Register
        </button>

        <div className="my-4 flex items-center justify-center text-gray-400">
          <hr className="flex-grow border-t border-gray-400 mx-2" />
          or
          <hr className="flex-grow border-t border-gray-400 mx-2" />
        </div>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-black font-semibold">Login</Link>
        </p>
      </form>
    </div>
  );
}

