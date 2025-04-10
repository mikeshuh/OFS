import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { checkLogin  } from "../utils/Utility";
import { useAuth } from "../components/AuthContext";
import loginBackground from "../assets/login.jpg"

const Login = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  // Direct user home if already logged in
  const auth = useAuth();
  useEffect(() => {
    (async () => {
      const response = await checkLogin();
      if (response) {
        navigate("/");
      }

    })();
  }, []);

  const [errorMessage, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(false);

  // Error message for login
  const setError = (errorMessage) => {
    setLoginError(true);
    setMessage(errorMessage);
  };

  // Action listener for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Logic to login user
  const loginDB = async (e) => {
    e.preventDefault();
    try {
      const response = await auth.loginAction(formData);
      console.log("Response login: ", response);
      if (!response.data?.success) {
        setError(response.data?.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Content with Background Image */}
      <div className="flex flex-1 relative">
        {/* Background Image */}
        <img
          src={loginBackground}
          alt="Fresh food background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Content overlay */}
        <div className="flex flex-1 justify-center items-center px-4 py-10 relative z-10">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-lg rounded-xl p-8 transition-all duration-300 hover:shadow-xl">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
              Welcome Back
            </h1>

            {/* Display Error Message */}
            {loginError && (
              <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={loginDB} className="space-y-6">
              <div className="flex flex-col text-left">
                <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col text-left">
                <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded transition-colors duration-300"
              >
                Login
              </button>
            </form>

            {/* Signup Link */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 mb-3">Don't have an account?</p>
              <Link
                to="/signup"
                className="inline-block px-6 py-2.5 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors duration-300 text-sm font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
