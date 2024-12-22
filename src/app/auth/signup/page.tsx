"use client";

import React, { useState } from "react";
import { useSignupMutation } from "@/services/store/modules/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { isLoading, error }] = useSignupMutation();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ email, password }).unwrap();
      alert("Signup successful!");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Signup
        </h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg shadow-sm ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300"
            }`}
          >
            {isLoading ? "Signing up..." : "Signup"}
          </button>
        </form>
        {error && (
          <p className="text-sm text-red-600 mt-3">
            {JSON.stringify("data" in error ? error.data : "An error occurred")}
          </p>
        )}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            Already have an account?
          </span>
          <a
            href="/signin"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Signin
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
