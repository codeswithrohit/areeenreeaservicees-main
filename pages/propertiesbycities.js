import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

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

  console.log("fetchedData", fetchedData);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="relative">
                  <div className="relative h-[240px] w-full">
                    <Carousel
                      showThumbs={false} // Hide thumbnails
                      infiniteLoop // Infinite looping of the carousel
                      useKeyboardArrows // Allow navigation using keyboard arrows
                      autoPlay // Automatically play the carousel
                      interval={3000} // Time interval between slides (in milliseconds)
                    >
                      {item.imgSrc.map((src, index) => (
                        <div key={index} className="w-full h-64">
                          <img src={src} alt="image" className="w-full h-64 object-cover" />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xl font-mono font-semibold text-center">
                      {item.type === 'Resortdetail' ? item.ResortName :
                       item.type === 'Banqueethalldetail' ? item.BanqueethallName :
                       item.type === 'Hoteldetail' ? item.HotelName :
                       item.type === 'pgdetail' ? item.PGName :
                       item.type === 'buydetail' ? item.Propertyname :
                       item.type === 'rentdetail' ? item.PropertyName : 'N/A'
                      }
                    </p>
                    <div className="flex justify-center">
                      <p className="text-sm text-gray-500 font-mono font-semibold flex text-center"><FaMapMarkerAlt className="text-red-500 mr-2" />{formatLocation(item.location)}</p>
                    </div>
                    {item.type === 'Banqueethalldetail' ? (
                      <div className='flex'>
                        <p className='font-mono text-center font-bold'><i className="fa-solid fa-utensils me-2"></i>Veg Plate: ₹{item.vegperplate || 'N/A'}</p>
                        <p className='font-mono text-center font-bold'><i className="fa-solid fa-burger me-2"></i>Non-Veg Plate: ₹{item.nonvegperplate || 'N/A'}</p>
                      </div>
                    ) : item.type === 'Resortdetail' || item.type === 'Hoteldetail' || item.type === 'pgdetail' ? (
                      <>
                        {item.roomTypes && item.roomTypes.map((property, i) => (
                          <div className='flex justify-center' key={i}>
                            <p className='text-gray-900 font-bold font-mono'>{i + 1}. {property.type}-{property.price}</p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {item.propertytypes.map((property, i) => (
                          <div className='flex justify-center' key={i}>
                            <span className="text-gray-900 font-bold font-mono">{i + 1}. {property.type} - {property.price}</span>
                          </div>
                        ))}
                      </>
                    )}
                    <p className='font-semibold font-mono text-center'>Distance: {item.distance ? item.distance : 'Calculating...'}</p>
                    <div className='flex items-center justify-center' >
                    <button  onClick={() => handleBookMeClick(item.type, item.id)} class="hover:brightness-80 hover:animate-pulse font-bold py-2 px-6 rounded-full bg-gradient-to-r from-emerald-200 to-emerald-800 text-white">Book Me</button>
                      </div>
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
