import React, { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { db } from "../Firebase/config";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Firebase/config";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [firebaseError, setFirebaseError] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    let tempErrors = {};
    setFirebaseError(""); 
   
    if (!email.includes("@")) tempErrors.email = "Invalid email format";
    if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      
      if (err.code === "auth/invalid-credential") {
        setFirebaseError("Incorrect email or password.");
      } else {
        setFirebaseError("Something went wrong. Please try again.");
      }
    }
  };

const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        username: user.displayName || "No Name",
        photo: user.photoURL || "",
        email: user.email,
        createdAt: new Date(),
      });
    }

    toast.success("Logged in with Google!");
    navigate("/");
  } catch (err) {
    console.error("Google Sign-In Error:", err);
    toast.error("Google Sign-In failed. Try again.");
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white text-black p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className={`w-full p-2 border ${errors.email ? "border-red-500" : "border-black"} rounded mb-1`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

        <input
          type="password"
          placeholder="Password"
          className={`w-full p-2 mt-4 border ${errors.password ? "border-red-500" : "border-black"} rounded mb-1`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}

        {firebaseError && <div className="text-red-500 text-sm mt-2">{firebaseError}</div>}

        <button
          type="submit"
          className="w-full bg-black text-white hover:bg-gray-900 font-semibold py-2 mt-6 rounded"
        >
          Login
        </button>

        <div className="my-4 flex items-center justify-center text-gray-400">
          <hr className="flex-grow border-t border-gray-400 mx-2" />
          or
          <hr className="flex-grow border-t border-gray-400 mx-2" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-semibold py-2 mt-4 rounded"
        >
          <FcGoogle className="text-xl" /> Login with Google
        </button>
      </form>

      <div className="mt-6 text-white">
        Don’t have an account?{" "}
        <Link to="/register" className="underline hover:text-gray-300">
          Register
        </Link>
      </div>
    </div>
  );
}
