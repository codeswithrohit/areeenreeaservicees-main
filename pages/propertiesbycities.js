import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaMapMarkerAlt,FaStar } from 'react-icons/fa';
const PropertiesByCities = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { location } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collections = [
          'Resortdetail',
          'rentdetail',
          'pgdetail',
          'Hoteldetail',
          'buydetail',
          'Banqueethalldetail'
        ];

        const fetchPromises = collections.map(async (collectionName) => {
          const collectionRef = firebase.firestore().collection(collectionName).where('Verified', '==', 'true');
          const querySnapshot = await collectionRef.get();
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            distance: null,
            type: collectionName
          }));
        });

        const allData = (await Promise.all(fetchPromises)).flat();
        console.log('Fetched Data:', allData);

        // Calculate distance
        const updatedData = await Promise.all(allData.map(async (item) => {
          const formattedDistance = await calculateDistance(location, item.location);
          return {
            ...item,
            distance: formattedDistance,
          };
        }));

        setFetchedData(updatedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  useEffect(() => {
    if (loading) return;

    // Filter by location and category
    const filterByLocation = (data, location) => {
      if (!location) return data;
      const locationUpper = location.toUpperCase();
      return data.filter(item => item.location.toUpperCase().includes(locationUpper));
    };

    const filteredByLocation = filterByLocation(fetchedData, location);

    if (selectedCategory === 'All') {
      setFilteredData(filteredByLocation);
    } else {
      setFilteredData(filteredByLocation.filter(item => item.type === selectedCategory));
    }
  }, [selectedCategory, fetchedData, location, loading]);

  const calculateDistance = (location1, location2) => {
    return new Promise((resolve, reject) => {
      if (location1?.trim() && location2?.trim()) {
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [location1],
            destinations: [location2],
            travelMode: 'DRIVING',
          },
          (response, status) => {
            if (status === 'OK' && response.rows[0]?.elements[0]?.distance) {
              const { distance } = response.rows[0].elements[0];
              resolve(distance.text);
            } else {
              console.log('Error:', status);
              reject('Error calculating distance');
            }
          }
        );
      } else {
        reject('Invalid locations');
      }
    });
  };

  // Function to extract city and state from location
  const formatLocation = (location) => {
    if (!location) return 'Location not available';

    // Assuming the location is in the format "Address, City, State, Country"
    const parts = location.split(',');
    if (parts.length >= 3) {
      const city = parts[1].trim();
      const state = parts[2].trim();
      return `${city}, ${state}`;
    }

    return location; // Fallback in case the format is different
  };

  const handleBookMeClick = (type, id) => {
    let href = '';

    switch (type) {
      case 'pgdetail':
        href = `/pgdetail?id=${id}`;
        break;
      case 'buydetail':
        href = `/listing-details-2?id=${id}`;
        break;
      case 'rentdetail':
        href = `/rentdetail?id=${id}`;
        break;
      case 'Hoteldetail':
        href = `/hoteldetail?id=${id}`;
        break;
      case 'Resortdetail':
        href = `/resortdetail?id=${id}`;
        break;
      case 'Banqueethalldetail':
        href = `/banqueetdetail?id=${id}`;
        break;
      default:
        href = `/property?id=${id}`;
        break;
    }

    router.push(href);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (totalRating / reviews.length).toFixed(1); // Round to one decimal
  };

  const renderStars = (average) => {
    const fullStars = Math.floor(average);
    const halfStar = average - fullStars >= 0.5;
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={i} className="text-yellow-500" />
        ))}
        {halfStar && <FaStar className="text-yellow-500 opacity-50" />}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
          <FaStar key={i + fullStars} className="text-gray-300" />
        ))}
      </div>
    );
  };

  console.log("fetchedData", filteredData);

  return (
    <div>
      <Head>
        <title>Properties By Cities</title>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAoNz2LqEAQJjrBYsVKDs6gHQpIulUslxk&libraries=places`}
          async
          defer
        ></script>
      </Head>
      <section>
        <div className="max-w-[90%] lg:max-w-[85%] mx-auto my-8 md:my-12 lg:my-20">
          <div className="text-center">
            <p className="text-lg mb-2 font-mono text-[#43d3b1]">FEATURED PROPERTIES</p>
            <p className="text-3xl font-mono font-semibold">Recommended for you</p>
            <div className="flex justify-center">
              <h2 className="text-sm flex items-center space-x-2">
                <FaMapMarkerAlt className="text-red-500" />
                <span className="text-red-500 font-bold font-mono">Near {location}</span>
              </h2>
            </div>
          </div>
          <div className="w-full mx-auto mt-8 mb-4">
            <div className="grid grid-cols-3 gap-4 md:grid-cols-3 lg:grid-cols-5 font-mono xl:grid-cols-6">
              <button onClick={() => setSelectedCategory('All')} className={`px-4 py-2 ${selectedCategory === 'All' ? 'bg-[#43d3b1] text-white' : 'bg-color3'} font-medium rounded-lg hover:bg-[#43d3b1] duration-200 text-center`}>All</button>
              <button onClick={() => setSelectedCategory('pgdetail')} className={`px-4 py-2 ${selectedCategory === 'pgdetail' ? 'bg-[#43d3b1] text-white' : 'bg-color3'} font-medium rounded-lg hover:bg-[#43d3b1] duration-200 text-center`}>ARENE PG</button>
              <button onClick={() => setSelectedCategory('buydetail')} className={`px-4 py-2 ${selectedCategory === 'buydetail' ? 'bg-[#43d3b1] text-white' : 'bg-color3'} font-medium rounded-lg hover:bg-[#43d3b1] duration-200 text-center`}>BUY PROPERTY</button>
              <button onClick={() => setSelectedCategory('rentdetail')} className={`px-4 py-2 ${selectedCategory === 'rentdetail' ? 'bg-[#43d3b1] text-white' : 'bg-color3'} font-medium rounded-lg hover:bg-[#43d3b1] duration-200 text-center`}>RENT PROPERTY</button>
              <button onClick={() => setSelectedCategory('Hoteldetail')} className={`px-4 py-2 ${selectedCategory === 'Hoteldetail' ? 'bg-[#43d3b1] text-white' : 'bg-color3'} font-medium rounded-lg hover:bg-[#43d3b1] duration-200 text-center`}>ARENE HOTELS</button>
              <button onClick={() => setSelectedCategory('Banqueethalldetail')} className={`px-4 py-2 ${selectedCategory === 'Banqueethalldetail' ? 'bg-[#43d3b1] text-white' : 'bg-color3'} font-medium rounded-lg hover:bg-[#43d3b1] duration-200 text-center`}>BANQUEET HALL</button>
              <button onClick={() => setSelectedCategory('Resortdetail')} className={`px-4 py-2 ${selectedCategory === 'Resortdetail' ? 'bg-[#43d3b1] text-white' : 'bg-color3'} font-medium rounded-lg hover:bg-[#43d3b1] duration-200 text-center`}>ARENE RESORT</button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center">
              <div className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin aspect-square w-8 h-8 flex justify-center items-center text-yellow-700"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center">
              <p className="text-lg text-gray-700">No properties available for this location.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition"
              >
                <div className="relative h-48">
                  {item.roomTypes?.[0]?.images?.[0] || item.propertytypes?.[0]?.images?.[0] ? (
                    <img
                      src={
                        item.roomTypes?.[0]?.images?.[0] ||
                        item.propertytypes?.[0]?.images?.[0]
                      }
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 truncate">
                    {item.ResortName || item.Propertyname || item.PGName || item.HotelName || item.BanqueethallName || 'N/A'}
                  </h3>
                  <div className="flex items-center">
              {renderStars(calculateAverageRating(item.reviews))}
              <span className="ml-2 text-sm text-gray-600">
                {calculateAverageRating(item.reviews)} / 5
              </span>
            </div>
                  <p className="text-sm text-gray-500 flex items-center mt-2">
                    <FaMapMarkerAlt className="text-teal-500 mr-2" />
                    {item.nearby}, {item.district}( near {item.distance} from  {location})
                  </p>
                  <div className="mt-4">
                    {(item.roomTypes || item.propertytypes)?.map((property, i) => (
                      <p key={i} className="text-sm text-gray-700">
                        {i + 1}. {property.type} - ₹{property.price}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => handleBookMeClick(item.type, item.id)}
                    className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
                  >
                    BOOK ME NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default PropertiesByCities;
