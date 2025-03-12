import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import DiscountBanner from "../components/DiscountBanner.jsx";
import { requestServer, checkLogin } from "../utils/Utility.jsx";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await checkLogin();
        if (response) {
          navigate("/profile");
        }
      } catch (error) {
        window.alert(error);
      }
    })();
  }, [navigate]);

  const [errorMessage, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(false);

  const LoginError = (errorMessage) => {
    setLoginError(true);
    setMessage(errorMessage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loginDB = async (e) => {
    e.preventDefault();
    try {
      const response = await requestServer(
        "http://localhost:5000/api/users/login",
        "POST",
        "",
        formData
      );
      if (response.data?.success) {
        const data = await response.data;
        localStorage.setItem("authToken", data.data?.token);
        navigate("/profile");
      } else {
        const errorData = response.data;
        LoginError(errorData?.message || "An error occurred. Please try again later.");
      }
    } catch (error) {
      LoginError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Discount Banner */}
      <DiscountBanner />

      {/* Content Center */}
      <div className="flex flex-1 justify-center items-center px-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            User Login
          </h1>

          {loginError && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-sm">
              {errorMessage}
            </div>
          )}
          {/* <form onSubmit={(e) => {
            e.preventDefault();
            console.log("Simple onSubmit works");
            loginDB(e);
          }}>
            <input type="text" name="test" />
            <button type="submit">Test Submit</button>
          </form> */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
            <Link
              to="/signup"
              className="inline-block px-5 py-2 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors duration-300 text-sm font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
