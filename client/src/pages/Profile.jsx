import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { requestServer } from "../utils/Utility";
import profileBackground from "../assets/profile_background.jpg";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [viewMode, setView] = useState(true);
  const [profileData, setProfileData] = useState(JSON.parse(localStorage.getItem("userProfile")));

  const EditButton = () => setView(!viewMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const changeProfile = async (e) => {
    e.preventDefault();
    auth.changePassword(formData);
  };

  return (
    <div className="min-h-screen relative">
      {/* 背景图：z-0 */}
      <img
        src={profileBackground}
        alt="Profile Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Navbar：固定在顶部，确保在背景图上层 */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* 内容区域：半透明 + 美化，z-10 */}
      <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl font-semibold text-white mb-10 drop-shadow-md tracking-wide">Profile Page</h1>

        {profileData ? (
          <>
            <div className="flex flex-col space-y-4 w-full max-w-md p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
              <p className="text-gray-800 text-lg">
                <span className="font-semibold text-green-700">First Name:</span> {profileData.firstName}
              </p>
              <p className="text-gray-800 text-lg">
                <span className="font-semibold text-green-700">Last Name:</span> {profileData.lastName}
              </p>
              <p className="text-gray-800 text-lg">
                <span className="font-semibold text-green-700">Email:</span> {profileData.email}
              </p>

              {viewMode ? (
                <div className="flex flex-col items-center space-y-4 pt-4">
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-2 rounded transition"
                    onClick={() => navigate("/orders")}
                  >
                    View History
                  </button>
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-2 rounded transition"
                    onClick={EditButton}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={changeProfile} className="flex flex-col items-center space-y-4 pt-4">
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="flex flex-col w-full space-y-2">
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={EditButton}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                    >
                      Cancel Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        ) : (
          <p className="text-white drop-shadow">Loading profile data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
