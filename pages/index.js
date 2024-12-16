import Link from "next/link";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import HomePage from "../src/components/HomePage";
import Explorecity from "../components/ExploreCity";
import ExploreProperties from "../components/ExploreProperties";
import Propertytype from "../components/Propertytype";
import OurService from "../components/OurService";
import { useLoadScript } from '@react-google-maps/api';
import { useRouter } from 'next/router';
import WatchHistory from "../components/WatchHistory";

const Counter = dynamic(() => import("../src/components/Counter"), {
  ssr: false,
});

// Define the places library to use with Google Maps API
const libraries = ['places'];

const Index = ({userData}) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locations, setLocations] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Load Google Maps API with the places library using environment variables
  const { isLoaded, loadError: mapLoadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Use environment variable
    libraries,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);

          try {
            // Fetch location name using reverse geocoding with the API key from environment variables
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const addressComponents = data.results[0].address_components;
              const cityName = addressComponents.find(component => component.types.includes('locality'));
              const stateName = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
              const countryName = addressComponents.find(component => component.types.includes('country'));

              const detailedLocation = [cityName, stateName, countryName]
                .filter(component => component !== undefined)
                .map(component => component.long_name)
                .join(', ');

              setLocations(detailedLocation);
            } else {
              setLocations("Location not found");
            }
          } catch (error) {
            console.error('Error fetching location:', error);
            setLocations("Error fetching location");
          }
        },
        (error) => {
          // Handle Geolocation errors
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              setLoadError("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              setLoadError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              setLoadError("The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              console.error("An unknown error occurred.");
              setLoadError("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoadError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Handling maps API loading errors
  if (mapLoadError) {
    return <div>Error loading Google Maps API: {mapLoadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>; // Return loading state until Maps API is loaded
  }

  return (
    <div className="bg-white" >
      {/* Home Page */}
     
      <HomePage />
      {/* Explore City Section */}
      <Explorecity />
      {/* Explore Properties Section with fetched location */}
      <ExploreProperties userData={userData} locations={locations} />
      
      {/* Statistics Section */}
      <div className="bg-white p-4 min-h-[150px] flex items-center justify-center font-[sans-serif] text-[#333]">
        <div className="bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.2)] grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-24 gap-12 rounded-3xl px-20 py-10">
          <div className="text-center">
            <h3 className="text-4xl font-extrabold">5.4<span className="text-blue-600">M+</span></h3>
            <p className="text-gray-500 font-semibold mt-3">Total Users</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-extrabold">$80<span className="text-blue-600">K</span></h3>
            <p className="text-gray-500 font-semibold mt-3">Revenue</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-extrabold">100<span className="text-blue-600">K</span></h3>
            <p className="text-gray-500 font-semibold mt-3">Engagement</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-extrabold">99.9<span className="text-blue-600">%</span></h3>
            <p className="text-gray-500 font-semibold mt-3">Server Uptime</p>
          </div>
        </div>
      </div>
      <WatchHistory/>
      {/* Our Services Section */}
      <OurService />
    </div>
  );
};

export default Index;
