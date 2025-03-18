import { use, useEffect } from "react";
import Navbar from "../components/Navbar";
import DiscountBanner from "../components/DiscountBanner";
import { requestServer} from "../utils/Utility";
import { useAuth } from "../components/AuthContext";

function Logout() {
  const auth = useAuth();
  useEffect(() => {
     (async () => {
      auth.logOut();
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
