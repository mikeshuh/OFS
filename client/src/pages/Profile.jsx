import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import profileBackground from "../assets/profile_background.webp";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    passwordConfirmed: "",
  });
  const [viewMode, setView] = useState(true);
  const [profileData, setProfileData] = useState(
    JSON.parse(localStorage.getItem("userProfile"))
  );
  const [message, setMessage] = useState("");

  const editButton = () => setView(!viewMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Logic to change user password
  const changeProfile = async (e) => {
    e.preventDefault();

    // 1. Pull & trim
    const currentPassword    = formData.currentPassword?.trim()    || "";
    const newPassword        = formData.newPassword?.trim()        || "";
    const passwordConfirmed  = formData.passwordConfirmed?.trim()  || "";

    // 2. Generic missing-fields check
    if (!currentPassword || !newPassword || !passwordConfirmed) {
      setMessage("Please fill in all required fields.");
      return;
    }

    // 3. currentPassword length (must be < 64 chars)
    if (currentPassword.length > 64) {
      setMessage("Current password must be less than 64 characters long.");
      return;
    }

    // 4. Aggregate newPassword rules
    const pwErrors = [];
    if (newPassword.length < 8) {
      pwErrors.push("at least 8 characters");
    }
    if (newPassword.length > 64) {
      pwErrors.push("no more than 64 characters");
    }
    if (!/[A-Z]/.test(newPassword)) {
      pwErrors.push("one uppercase letter");
    }
    if (!/[a-z]/.test(newPassword)) {
      pwErrors.push("one lowercase letter");
    }
    if (!/[0-9]/.test(newPassword)) {
      pwErrors.push("one number");
    }
    if (!/[@$!%*?&]/.test(newPassword)) {
      pwErrors.push("one special character (@, $, !, %, *, ?, &)");
    }
    if (pwErrors.length) {
      setMessage(`New password must contain ${pwErrors.join(", ")}.`);
      return;
    }

    // 5. Password confirmation
    if (passwordConfirmed !== newPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // 6. All checks passed → call backend
    try {
      const errorMsg = await auth.changePassword({ currentPassword, newPassword, passwordConfirmed });
      setMessage(errorMsg);
    } catch (err) {
      console.error("Error changing password:", err);
      setMessage("Failed to change password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Background & Content Wrapper */}
      <div className="flex flex-1 relative">
        {/* Background Image */}
        <img
          src={profileBackground}
          alt="Profile background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay Content */}
        <div className="flex flex-1 justify-center items-center px-4 py-10 relative z-10">
          {profileData ? (
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm shadow-lg rounded-xl p-8 transition-all duration-300 hover:shadow-xl">
              <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                Profile Page
              </h1>

              <div className="space-y-3 text-gray-700 mb-6">
                <p>
                  <span className="font-semibold text-green-700">First Name:</span> {profileData.firstName}
                </p>
                <p>
                  <span className="font-semibold text-green-700">Last Name:</span> {profileData.lastName}
                </p>
                <p>
                  <span className="font-semibold text-green-700">Email:</span> {profileData.email}
                </p>
              </div>

              {viewMode ? (
                <div className="flex flex-col items-center space-y-4">
                  <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded transition-colors duration-300"
                    onClick={() => navigate("/orders")}
                  >
                    View Order History
                  </button>
                  <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded transition-colors duration-300"
                    onClick={editButton}
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                <form onSubmit={changeProfile} className="space-y-4">
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="password"
                    name="passwordConfirmed"
                    placeholder="Confirm New Password"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {message && (
                    <p className="flex items-center justify-center text-red-500 text-sm ">{message}</p>
                  )}
                  <div className="flex flex-col space-y-2">
                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded transition-colors duration-300"
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={editButton}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <p className="text-white text-xl">Loading profile data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
