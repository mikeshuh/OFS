import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import requestServer from "../utils/Utility";
import DiscountBanner from "../components/DiscountBanner";

const Profile = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [viewMode, setView] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const EditButton = () => {
    setView(!viewMode);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  const changeProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decode = jwtDecode(token);
        const response = await requestServer(`http://localhost:5000/api/users/change-password/${decode.id}`, "PUT", token, formData);
        if (response.data?.success) {
          // Handle successful login (e.g., navigate to profile page)
          window.alert("Profile Changed Successfully");
          window.location.reload();
        } else {
          // Handle error response
          const errorData = response.data;
          window.alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        return error
      }
    }
  };
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decode = jwtDecode(token);
          const response = await requestServer(`http://localhost:5000/api/users/profile/${decode.id}`, "GET", token);
          if (response.data?.success) {
            const data = response.data;
            setProfileData(data);
          } else {
            const errorData = response.data;
            window.alert(`Error: ${errorData.message}`);
          }
        } catch (error) {
          window.alert(`Failed to fetch profile data`);
        }
      }
    };
    fetchProfileData();
  }, []);

  return (
    <div>
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div style={styles.container}>
        <h1>Profile Page</h1>
        {profileData ? (
          <>
            <div style={styles.searchContainer}>
              <div>
                <p>First Name: {profileData.data?.firstName}</p>
              </div>
              <div>
                <p>Last Name: {profileData.data?.lastName}</p>
              </div>
              {/* viewMode: for displaying profile data
                  !viewMode: for editing profile
               */}
              {viewMode ? (
                <div>
                  <p>Email: {profileData.data?.email}</p>
                  <button style={styles.profileButton}>
                    View History
                  </button>
                  <button style={styles.editButton} onClick={EditButton}>
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form style={styles.form} onSubmit={changeProfile}>
                  <input
                    type="currentPassword"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="Current Password"
                    onChange={handleChange}
                    style={styles.searchInput}
                  />
                  <br></br>
                  <input
                    type="newPassword"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New Password"
                    onChange={handleChange}
                    style={styles.searchInput}
                  />
                  <br></br><br></br>
                  <button type="submit" style={styles.exitButton}>
                    Save Changes
                  </button>
                  <button style={styles.exitButton} onClick={EditButton}>
                    Cancel Changes
                  </button>
                </form>
              )}
            </div>

          </>
        ) : (
          <p>Loading profile data...</p>
        )}
      </div>
    </div>
  );
};
// CSS
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 50px",
    backgroundColor: "#28a745", // Green
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
  },
  logoContainer: { flex: 1 },
  logo: { height: "50px" },
  navLinks: {
    flex: 2,
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "10px",
    transition: "color 0.3s ease",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1.5,
    margin: "5px",
    gap: "1px",
    padding: "5px",
    alignItems: "center",
    justifyContent: "center",

  },
  searchInput: {
    padding: "8px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    outline: "none",
    margin: "5px",
    width: "180px"
  },
  searchButton: {
    backgroundColor: "#fff",
    border: "1px solid #28a745",
    color: "#28a745",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },
  authButtons: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },

  button: {
    textDecoration: "none",
    backgroundColor: "#fff",
    color: "#28a745",
    padding: "8px 15px",
    borderRadius: "5px",
    fontSize: "14px",
    fontWeight: "bold",
    border: "2px solid #28a745",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  container: {
    textAlign: "center",
    padding: "50px"
  },
  profileButton: {
    margin: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },

  editButton: {
    margin: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },

  exitButton: {
    margin: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  formGroup: {
    display: 'block',
  },
  br: {
    display: 'block',
    marginbottom: "3px"

  }
};

export default Profile;
