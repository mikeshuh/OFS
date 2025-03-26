import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { requestServer, checkLogin } from "../utils/Utility";
import signupBackground from "../assets/signup.jpg"

const API_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await checkLogin();
      if (response) {
        navigate("/");
      }

    })();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmed: ""
  });

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
    <div className="min-h-screen flex flex-col">
      {/* Navbar component */}
      <Navbar />

      {/* Content with Background Image */}
      <div className="flex flex-1 relative">
        {/* Background Image */}
        <img
          src={signupBackground}
          alt="Organic ingredients background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Content overlay */}
        <div className="flex flex-1 justify-center items-center px-4 py-10 relative z-10">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-lg rounded-xl p-8 transition-all duration-300 hover:shadow-xl">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create Account</h1>

            {/* Display error message */}
            {signupError && (
              <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Signup form */}
            <form className="space-y-5" onSubmit={signupDB}>
              <div className="flex flex-col text-left">
                <label className="mb-2 text-sm font-medium text-gray-700">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="mb-2 text-sm font-medium text-gray-700">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter your Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="mb-2 text-sm font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="mb-2 text-sm font-medium text-gray-700">Password:</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="mb-2 text-sm font-medium text-gray-700">Confirm Password:</label>
                <input
                  type="password"
                  name="passwordConfirmed"
                  placeholder="Enter your password again"
                  value={formData.passwordConfirmed}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded transition-colors duration-300"
              >
                Sign Up
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 mb-3">Already have an account?</p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors duration-300 text-sm font-semibold"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
