import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import profileBackground from "../assets/profile_background.jpg";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const changeProfile = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage("All fields are required.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 8) {
      setMessage("New password must be at least 8 characters long.");
      return;
    }
    setMessage(""); // Clear previous messages
    const { currentPassword, newPassword } = formData;
    try {
      const errorMsg = await auth.changePassword({ currentPassword, newPassword });
      if (errorMsg) {
        setMessage(errorMsg.toLowerCase().includes("current password is incorrect") ? errorMsg : "Failed to change password.");
        return;
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Failed to change password.");
      return;
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
                    View History
                  </button>
                  <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded transition-colors duration-300"
                    onClick={editButton}
                  >
                    Edit Profile
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
                    name="confirmPassword"
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
                      Save Changes
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
