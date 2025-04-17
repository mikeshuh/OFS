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
    email: "",
    password: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [viewMode, setView] = useState(true);
  const [profileData, setProfileData] = useState(JSON.parse(localStorage.getItem("userProfile")));

  const EditButton = () => setView(!viewMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const changeProfile = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    const { currentPassword, newPassword } = formData;
    auth.changePassword({ currentPassword, newPassword });
  };

  return (
    <div
      className="min-h-[110vh] overflow-hidden bg-cover bg-fixed px-4 sm:px-6 lg:px-8 pt-36 pb-40 relative"
      style={{ backgroundImage: `url(${profileBackground})` }}
    >
      {/* 固定顶部 Navbar */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar />
      </div>

      {/* 主体内容 */}
      <div className="flex justify-center relative z-10">
        {profileData ? (
          <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-lg rounded-xl p-8 transition-all duration-300 hover:shadow-xl">
            <h1 className="text-2xl font-semibold text-center text-black mb-4">Profile Page</h1>

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
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
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
        ) : (
          <p className="text-white drop-shadow">Loading profile data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
