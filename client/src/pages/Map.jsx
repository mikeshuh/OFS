import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Navbar from "../components/Navbar";
import { SearchBox } from "@mapbox/search-js-react";
import { requestServer } from "../utils/Utility";
import * as turf from "@turf/turf";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const API_URL = import.meta.env.VITE_API_URL;
const FIXED_CENTER = [-121.879695, 37.33599];
const RADIUS_MILES = 25;

const Map = () => {
  /*
    information about these variables:
    mapContainerRef: the reference to the map container
    mapRef: the reference to the map instance
    markerRef: the reference to the marker instance
    value: the value of the search box, takes user input for address
    text: the text to display in the delivery check section
    backgroundColor: the background color of the delivery check section
  */
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [value, setValue] = useState("");
  const [text, setText] = useState("Enter your location to see if your address is in our delivery area.");
  const [backgroundColor, setBackgroundColor] = useState("text-gray-600");

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

    // Control panel for the map, for zooming in and out and rotation
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-left");

    return () => mapRef.current.remove(); // Cleanup on unmount
  }, []);

  const handleRetrieve = async (retrieve) => {
    if (!mapRef.current || !retrieve.features[0]) return;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const addressData = {
      destination: {
        zipCode: retrieve.features[0].properties.context.postcode.name,
        streetAddress: retrieve.features[0].properties["full_address"],
        city: retrieve.features[0].properties.context.place.name,
      },
    };
    const token = localStorage.getItem("authToken");
    const response = await requestServer(`${API_URL}/api/delivery/check`, "POST", token, JSON.stringify(addressData));

    if (response.data.success) {
      setText(response.data.data.message);
      setBackgroundColor(response.data.data.message.includes("Congradulation") ? "bg-green-100" : "bg-yellow-100");

      const [lng, lat] = retrieve.features[0].geometry.coordinates;
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14, speed: 3.5 });
      markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
    } else {
      setBackgroundColor("bg-red-100");
      setText("The address is either not valid or out of the country, please try again with a different address.");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full border-b-4 border-gray-300 shadow-md">
        <Navbar />
      </div>

      <div className="flex h-full">
        <div className="w-1/3 h-full p-6 bg-white shadow-lg border-r-2 border-gray-300 flex flex-col">
          <h1 className="text-2xl font-semibold text-left mb-4">Food Delivery Coverage Checker</h1>
          <div>
            <SearchBox value={value} onChange={setValue} accessToken={MAPBOX_ACCESS_TOKEN} onRetrieve={handleRetrieve} />
          </div>
          <div className={`mt-4 p-4 rounded-lg shadow-sm ${backgroundColor}`}>
            <h2 className="text-lg font-semibold text-gray-800">Delivery Check</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">{text}</p>
          </div>
        </div>

        <div className="w-2/3 h-full">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Map;
