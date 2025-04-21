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
      className="h-screen overflow-hidden bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${profileBackground})` }}
    >
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar />
      </div>

      {/* Centered Content */}
      <div className="h-full flex items-center justify-center px-4 relative z-10">
        {profileData ? (
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile Page</h1>

            <div className="space-y-3 text-gray-700">
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
              <div className="flex flex-col items-center space-y-4 pt-6">
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-2 rounded-lg transition"
                  onClick={() => navigate("/orders")}
                >
                  View History
                </button>
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-2 rounded-lg transition"
                  onClick={EditButton}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={changeProfile} className="flex flex-col items-center space-y-4 pt-6">
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex flex-col w-full space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={EditButton}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                  >
                    Cancel Changes
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
  );
};

export default Profile;
