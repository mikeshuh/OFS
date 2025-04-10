import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Navbar from "../components/Navbar";
import { SearchBox } from "@mapbox/search-js-react";
import { requestServer } from "../utils/Utility";
import * as turf from "@turf/turf";
import { useCart } from "../components/CartContext";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const API_URL = import.meta.env.VITE_API_URL;
const FIXED_CENTER = [-121.879695, 37.33599];
const RADIUS_MILES = 25;

const CheckoutMap = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Map refs
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // State variables
  const [value, setValue] = useState("");
  const [text, setText] = useState("Enter your delivery address to proceed with checkout.");
  const [backgroundColor, setBackgroundColor] = useState("bg-gray-100");
  const [searchKey, setSearchKey] = useState(0);
  const [isInDeliveryZone, setIsInDeliveryZone] = useState(false);
  const [addressDetails, setAddressDetails] = useState(null);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the Mapbox map
    mapRef.current = new mapboxgl.Map({
      accessToken: MAPBOX_ACCESS_TOKEN,
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: FIXED_CENTER,
      zoom: 8.8,
    });

    // Create the radius for the delivery area
    const circleGeoJSON = (() => {
      const options = { steps: 64, units: "miles" };
      return turf.circle(FIXED_CENTER, RADIUS_MILES, options);
    })();

    // Add the circle to the map
    mapRef.current.on("load", () => {
      mapRef.current.addSource("circle-source", {
        type: "geojson",
        data: circleGeoJSON,
      });
      mapRef.current.addLayer({
        id: "circle-layer",
        type: "fill",
        source: "circle-source",
        paint: {
          "fill-color": "#1E90FF",
          "fill-opacity": 0.2,
        },
      });
    });

    // Control panel for the map
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-left");

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleRetrieve = async (retrieve) => {
    try {
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      if (!mapRef.current || !retrieve.features[0]?.properties?.context) return;
      const properties = retrieve.features[0].properties;
      const context = properties.context;

      if (!properties["address"] || !context.place || !context.region || !context.country) {
        setText("Please enter a valid address.");
        setBackgroundColor("bg-red-100");
        setIsInDeliveryZone(false);
        return;
      }

      // Store the complete address
      const address = {
        streetAddress: properties["address"],
        city: context.place.name,
        state: context.region.name,
        country: context.country.name,
        zipCode: context.postcode.name
      };

      setAddressDetails(address);

      // Set the text to the address
      setValue(`${properties["address"]}, ${context.place.name}, ${context.region.name}, ${context.country.name}`);
      setSearchKey(searchKey + 1);

      const addressData = {
        destination: {
          zipCode: context.postcode.name,
          streetAddress: properties["address"],
          city: context.place.name,
          country: context.country.name,
          state: context.region.name
        },
      };

      const token = localStorage.getItem("authToken");
      const response = await requestServer(`${API_URL}/api/delivery/check`, "POST", token, JSON.stringify(addressData));

      // Display the message for whether the address is in the delivery area
      if (response.data.success) {
        const isWithinZone = response.data.data.message.includes("Congratulations");
        setText(response.data.data.message);
        setBackgroundColor(isWithinZone ? "bg-green-100" : "bg-yellow-100");
        setIsInDeliveryZone(isWithinZone);

        const [lng, lat] = retrieve.features[0].geometry.coordinates;

        // Move the center to the new location
        mapRef.current.flyTo({ center: [lng, lat], zoom: 14, speed: 3.5 });

        // Add a marker to the new center
        markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
      }
    } catch (error) {
      console.error("Error retrieving address:", error);
      setBackgroundColor("bg-red-100");
      setIsInDeliveryZone(false);
      setText("An error occurred while checking the address, please try again.");
    }
  };

  // Handle confirming the address and proceeding to checkout
  const confirmAddress = () => {
    if (isInDeliveryZone && addressDetails) {
      // Save the delivery address to localStorage
      localStorage.setItem("deliveryAddress", JSON.stringify(addressDetails));

      // Navigate to checkout
      navigate("/checkout");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Navbar - Fixed at the top */}
      <div className="w-full border-b-4 border-gray-300 shadow-md">
        <Navbar />
      </div>

      {/* Container for layout */}
      <div className="flex h-full">
        {/* Sidebar (Search Box & Content) */}
        <div className="w-1/3 h-full p-6 bg-white shadow-lg border-r-2 border-gray-300 flex flex-col">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-left mb-4">
            Delivery Address
          </h1>

          {/* Search Box */}
          <div>
            <SearchBox
              options={{
                country: "us",
                bbox: [-124.4096, 32.5343, -114.1312, 42.0095], // Bounding box for California
                proximity: FIXED_CENTER, // Prioritize searches near the warehouse
              }}
              key={searchKey}
              value={value}
              accessToken={MAPBOX_ACCESS_TOKEN}
              onRetrieve={handleRetrieve} />
          </div>

          <div className={`mt-4 p-4 rounded-lg shadow-sm ${backgroundColor}`}>
            <h2 className="text-lg font-semibold text-gray-800">Delivery Check</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">{text}</p>
          </div>

          {/* Checkout flow buttons */}
          <div className="mt-auto">
            <button
              onClick={confirmAddress}
              disabled={!isInDeliveryZone}
              className={`w-full py-3 px-4 rounded font-medium ${
                isInDeliveryZone
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 cursor-not-allowed text-white"
              }`}
            >
              {isInDeliveryZone ? "Deliver to this Address" : "Select Valid Address"}
            </button>

            {!isInDeliveryZone && addressDetails && (
              <p className="text-sm text-red-600 mt-2 text-center">
                Please select an address within our delivery zone.
              </p>
            )}

            <button
              onClick={() => navigate("/cart")}
              className="w-full mt-3 py-2 px-4 text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded font-medium"
            >
              Return to Cart
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-2/3 h-full">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default CheckoutMap;
