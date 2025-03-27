import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
const Profile = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [viewMode, setView] = useState(true);
  const [profileData, setProfileData] = useState(JSON.parse(localStorage.getItem("userProfile")));
  console.log("Profile Data: ", profileData);
  // ViewModes: true -> view profile, false -> edit profile
  const EditButton = () => {
    setView(!viewMode);
  };

  // Action listener for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Logic to change profile
  const changeProfile = async (e) => {
    e.preventDefault();
    const response = auth.changePassword(formData);

  };



  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Page</h1>

        {profileData ? (
          <div className="flex flex-col space-y-4 w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <p className="text-gray-700">
              <span className="font-semibold">First Name:</span> {profileData.firstName}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Last Name:</span> {profileData.lastName}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {profileData.email}
            </p>

            {/* buttons */}
            {viewMode ? (
              <div className="flex flex-col items-center space-y-4">
                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300"
                  onClick={() => alert("View History clicked")}
                >
                  View History
                </button>

                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300"
                  onClick={EditButton}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              // Edit Profile Form
              <form
                onSubmit={changeProfile}
                className="flex flex-col items-center space-y-4"
              >
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Current Password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="New Password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <div className="flex flex-col w-full space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={EditButton}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300"
                  >
                    Cancel Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          // Message to show when profile data is loading
          <p className="text-gray-600">Loading profile data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
