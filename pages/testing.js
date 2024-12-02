import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { useRouter } from 'next/router';
import { FaMapMarkerAlt, FaBed, FaStar, FaCheckCircle } from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const HotelDetailsViewCard = () => {
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [pgdetaildata, setPgdetaildata] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const db = firebase.firestore();
    const pgRef = db.collection('pgdetail').doc(id);

    pgRef.get().then((doc) => {
      if (doc.exists) {
        setPgdetaildata(doc.data());
        if (doc.data().roomTypes?.length > 0) {
          setSelectedRoomType(doc.data().roomTypes[0]);
        }
      } else {
        console.log('Document not found!');
      }
      setIsLoading(false);
    });
  }, []);

  console.log('data', pgdetaildata);

  const handleRoomTypeSelect = (roomType) => {
    setSelectedRoomType(roomType);
  };

  const handleConfirmBooking = () => {
    if (selectedRoomType) {
      const formattedDate = moment().format('DD-MM-YYYY');
      router.push({
        pathname: '/booking',
        query: {
          Name: pgdetaildata.PGName,
          Agentid: pgdetaildata.AgentId,
          location: pgdetaildata.location,
          roomType: selectedRoomType.type,
          roomprice: selectedRoomType.price,
          checkInDate: formattedDate,
        },
      });
    } else {
      toast.error('Please select a room type to proceed');
    }
  };

  return (
    <div className="py-6 bg-white">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <div className="container bg-white mx-auto p-4">
          <div className="bg-white rounded-lg p-6">
          <div className="flex gap-6 ">
  {/* Carousel - 70% Width */}
  <div className="w-full lg:w-8/10 relative">
    <Carousel showThumbs={false} autoPlay>
      {selectedRoomType?.images?.map((image, index) => (
        <div key={index}>
          <img
            src={image}
            alt={`Room ${index}`}
            className="w-full h-64 object-cover mx-auto rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent rounded-lg"></div>
        </div>
      ))}
    </Carousel>
  </div>

  {/* Video Section - 30% Width */}
  {selectedRoomType?.videoSrc && (
    <div className="w-full lg:w-2/10">
      <div className="mt-4">
        <video
          controls
          className="w-full h-64 mx-auto rounded-lg shadow-md"
          src={selectedRoomType.videoSrc}
        />
      </div>
    </div>
  )}
</div>


            {/* Details */}
            <div className="mt-6">
              <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
                {pgdetaildata.PGName} <FaMapMarkerAlt className="text-blue-600" />
              </h1>
              <p className="text-gray-500 text-lg">{pgdetaildata.location}</p>
              <p className="mt-4 text-gray-700">{pgdetaildata.description}</p>

              {/* Benefits */}
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-800">Benefits</h2>
                <ul className="space-y-2 mt-2">
                  {pgdetaildata.benefits?.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <FaCheckCircle className="text-green-500" /> {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Room Types */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800">Room Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {pgdetaildata.roomTypes?.map((room, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg transition-transform transform hover:scale-105 cursor-pointer ${
                        selectedRoomType?.type === room.type
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-300'
                      }`}
                      onClick={() => handleRoomTypeSelect(room)}
                    >
                      <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                        <FaBed /> {room.type}
                      </h3>
                      <p className="flex items-center gap-2 text-gray-600">
                        <MdAttachMoney /> {room.price} INR
                      </p>
                      <p className="text-sm text-gray-500">
                        {room.availability} Available
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              {pgdetaildata.reviews && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
                  {pgdetaildata.reviews.map((review, index) => (
                    <div key={index} className="border-t py-4">
                      <p className="font-bold text-gray-800">{review.name}</p>
                      <div className="flex items-center text-yellow-500">
                        <FaStar /> {review.rating}
                      </div>
                      <p className="text-gray-600">{review.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Confirm Booking */}
              <button
                onClick={handleConfirmBooking}
                className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default HotelDetailsViewCard;
