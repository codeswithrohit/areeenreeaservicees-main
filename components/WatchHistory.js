import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt,FaStar } from 'react-icons/fa';
import { useRouter } from 'next/router';
const WatchHistory = () => {
    const router = useRouter();
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
  

    // Fetch data from localStorage
    const fetchedData = JSON.parse(localStorage.getItem('WatchHistory')) || [];
    setWatchHistory(fetchedData);

    // Log the data to the console
    // console.log('Fetched Watch History:', fetchedData);
  }, []);
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


  const handleBookMeClick = async (type, id) => {
    const routes = {
      pgdetail: `/pgdetail?id=${id}`,
      buydetail: `/listing-details-2?id=${id}`,
      rentdetail: `/rentdetail?id=${id}`,
      Hoteldetail: `/hoteldetail?id=${id}`,
      Resortdetail: `/resortdetail?id=${id}`,
      Banqueethalldetail: `/banqueetdetail?id=${id}`,
    };

 

    // Navigate to the relevant page
    router.push(routes[type] || `/property?id=${id}`);
  };
  return (
    <div className='max-w-8xl bg-white mx-auto  px-4' >
           {watchHistory.length > 0 && (
        <h1 className="text-4xl font-extrabold text-gray-900 py-4">
          Recently Viewed Properties
        </h1>
      )}
              <div className="flex gap-6 bg-white overflow-x-auto">
  {watchHistory.map((item) => (
    <div
      key={item.id}
      className="min-w-[300px] bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition"
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

     
    </div>
  );
};

export default WatchHistory;
