import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { FaMapMarkerAlt,FaStar } from 'react-icons/fa';

const ExploreProperties = ({userData}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
console.log("userDataaa",userData)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const collections = [
          'Resortdetail',
          'rentdetail',
          'pgdetail',
          'Hoteldetail',
          'buydetail',
          'Banqueethalldetail',
        ];

        const fetchPromises = collections.map(async (collectionName) => {
          const collectionRef = firebase
            .firestore()
            .collection(collectionName)
            .where('Verified', '==', 'true');
          const querySnapshot = await collectionRef.get();
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            distance: null,
            type: collectionName,
          }));
        });

        const allData = (await Promise.all(fetchPromises)).flat();
        setFetchedData(allData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (selectedCategory === 'All') {
      setFilteredData(fetchedData);
    } else {
      setFilteredData(fetchedData.filter((item) => item.type === selectedCategory));
    }
  }, [selectedCategory, fetchedData, loading]);

  const handleBookMeClick = async (type, id) => {
    const routes = {
      pgdetail: `/pgdetail?id=${id}`,
      buydetail: `/listing-details-2?id=${id}`,
      rentdetail: `/rentdetail?id=${id}`,
      Hoteldetail: `/hoteldetail?id=${id}`,
      Resortdetail: `/resortdetail?id=${id}`,
      Banqueethalldetail: `/banqueetdetail?id=${id}`,
    };

    const selectedProperty = fetchedData.find((item) => item.type === type && item.id === id);

    if (!selectedProperty) return;

    // Store in local storage
    const storedData = JSON.parse(localStorage.getItem('WatchHistory')) || [];
    storedData.push(selectedProperty);
    localStorage.setItem('WatchHistory', JSON.stringify(storedData));

    // Store in Firestore if userData is available
    if (userData) {
      try {
        const historyRef = firebase.firestore().collection('WatchHistory');
        await historyRef.add({
         userData,
          ...selectedProperty,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        // toast.success('Booking history saved successfully!');
      } catch (error) {
        console.error('Error saving history to Firestore:', error);
        // toast.error('Failed to save booking history.');
      }
    }

    // Navigate to the relevant page
    router.push(routes[type] || `/property?id=${id}`);
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
  return (
    <div className="bg-gray-50 ">
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`}
          async
          defer
        ></script>
      </Head>
      <section className="py-8">
        <div className="max-w-8xl mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-teal-600 uppercase">
              Featured Properties
            </p>
            <h1 className="md:text-4xl text-xl font-extrabold text-gray-900">Recommended for You</h1>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 justify-center">
  {[
    { label: 'All', value: 'All' },
    { label: 'ARENE PG', value: 'pgdetail' },
    { label: 'BUY PROPERTY', value: 'buydetail' },
    { label: 'RENT PROPERTY', value: 'rentdetail' },
    { label: 'ARENE HOTELS', value: 'Hoteldetail' },
    { label: 'BANQUET HALL', value: 'Banqueethalldetail' },
    { label: 'ARENE RESORT', value: 'Resortdetail' },
  ].map((category) => (
    <button
      key={category.value}
      onClick={() => setSelectedCategory(category.value)}
      className={`md:px-4 md:py-1 px-1 py-2 rounded-lg mb-1 text-xs md:text-sm font-semibold transition-transform transform ${
        selectedCategory === category.value
          ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg scale-105'
          : 'bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-teal-500 hover:to-teal-400 hover:text-white'
      } hover:scale-105 focus:outline-none`}
    >
      {category.label}
    </button>
  ))}
</div>




          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="loader border-t-4 border-teal-500 rounded-full w-10 h-10 animate-spin"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-gray-600">No properties available for this location.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-lg rounded-xl border-t-2 border0emerald-500 overflow-hidden hover:shadow-2xl transition"
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
                  <div className="px-4 py-3">
                    <h3 className="text-xl font-bold text-gray-800 truncate">
                      {item.ResortName || item.Propertyname || item.PGName || item.HotelName || item.BanqueethallName || 'N/A'}
                    </h3>
                    <div className="flex items-center">
                {renderStars(calculateAverageRating(item.reviews))}
                <span className="ml-2 text-sm text-gray-600">
                  {calculateAverageRating(item.reviews)} / 5
                </span>
              </div>
                    <p className="text-xs font-bold text-gray-900 flex items-center mt-2">
                      <FaMapMarkerAlt className="text-teal-500  text-2xl mr-2" />
                      {item.nearby}, {item.district}
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
    </div>
  );
};

export default ExploreProperties;
