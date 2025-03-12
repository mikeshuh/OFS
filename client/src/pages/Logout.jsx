import { useEffect } from "react";
import Navbar from "../components/Navbar";
import DiscountBanner from "../components/DiscountBanner";
import { requestServer } from "../utils/Utility";

const Logout = () => {
  useEffect(() => {
     (async () => {
      const token = localStorage.getItem("authToken");
      try {
        localStorage.removeItem("authToken");
        const response = await requestServer("http://localhost:5000/api/users/logout","POST",token);
        if (response) {
          window.alert("You have been logged out.");
        }
      } catch (error) {
        console.error(error);
        window.alert("An error occurred during logout.");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Discount Banner */}
      <DiscountBanner />

      {/* Logout Content */}
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Logout</h2>
        <p className="text-lg text-gray-600">You have been logged out successfully.</p>
      </div>
    </div>
  );
};

export default Logout;
