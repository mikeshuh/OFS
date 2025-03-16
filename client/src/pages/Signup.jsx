import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { requestServer } from "../utils/Utility";
import DiscountBanner from "../components/DiscountBanner";

const API_URL = import.meta.env.VITE_API_URL;
const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmed: ""
  });
  const navigate = useNavigate();
  const [errorMessage, setMessage] = useState("");
  const [signupError, setSignupError] = useState(false);

  // Function to display error message
  const setError = (errorMessage) => {
    setSignupError(true);
    setMessage(errorMessage);
  };

  // Action listener for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle signup logic upon form submission
  const signupDB = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.passwordConfirmed) {
        setError("Passwords do not match");
        return;
      }
      const response = await requestServer(`${API_URL}/api/users/register`, "POST", "", formData);
      if (response.data?.success) {
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Network error. Please try again");
    }
  };

  return (
    <div>
      {/* Navbar component */}
      <Navbar />

      <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">New User Signup</h1>

        {/* Display error message */}
        {signupError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorMessage}</div>}

        {/* Signup form */}
        <form className="space-y-4" onSubmit={signupDB}>
          <div>
            <label className="block text-sm font-semibold text-gray-700">First Name:</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Last Name:</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Confirmed Password:</label>
            <input
              type="password"
              name="passwordConfirmed"
              placeholder="Enter your password again"
              value={formData.passwordConfirmed}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
