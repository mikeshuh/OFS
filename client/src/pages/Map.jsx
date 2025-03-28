import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Navbar from "../components/Navbar";
import { SearchBox } from "@mapbox/search-js-react";
import { requestServer } from "../utils/Utility";
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const API_URL = import.meta.env.VITE_API_URL;
const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [value, setValue] = useState("");
  const [text,setText] = useState("Enter your location to see if your address is in our delivery area.");

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the Mapbox map
    mapRef.current = new mapboxgl.Map({
      accessToken: MAPBOX_ACCESS_TOKEN,
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-121, 37], // Initial center
      zoom: 14,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-left");

    return () => mapRef.current.remove(); // Cleanup on unmount
  }, []);

  const handleRetrieve = async (retrieve) => {
    if (!mapRef.current || !retrieve.features[0]) return;
    console.log(retrieve.features[0].properties);
    const addressData = {
      origin:{
        zipCode: retrieve.features[0].properties.context.postcode.name,
        streetAddress: retrieve.features[0].properties["full_address"],
        city: retrieve.features[0].properties.context.place.name
      },
      destination:{
        zipCode: "95192",
        streetAddress: "1 Washington Sq",
        city: "San Jose"
      }
    }
    // console.log(addressData);
    const token = localStorage.getItem("authToken");
    const response = await requestServer(`${API_URL}/api/delivery/distance`, "POST", token, JSON.stringify(addressData));
    console.log(JSON.stringify(addressData));
    console.log(response);
    if (response.data.success) {

      console.log(response);
      setText("We do not deliver to your location.");
    }
    const [lng, lat] = retrieve.features[0].geometry.coordinates;
    // Fly to the new location
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 14,
    });
 };

  return (
    <div>
      {/* Navbar - Fixed at the top */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Container for layout */}
      <div className="relative min-h-screen flex">
        {/* Sidebar (Search Box & Content) */}
        <div className="w-1/3 p-4 bg-gray-50 overflow-auto h-screen">
          <SearchBox
            value={value}
            onChange={setValue}
            accessToken={MAPBOX_ACCESS_TOKEN}
            onRetrieve={handleRetrieve}
          />
          <div className="mt-4">
            <h2 className="text-lg font-bold">Locations</h2>
            <p>{text}</p>
          </div>
        </div>

        {/* Map Container - Fixed in place */}
        <div className="w-2/3 h-screen fixed right-0 top-0">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
