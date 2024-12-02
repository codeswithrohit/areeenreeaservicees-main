import React, { useState, useEffect, useRef } from 'react';
import { firebase } from '../Firebase/config';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { MdAttachMoney } from 'react-icons/md';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {FaMapMarkerAlt, FaInfoCircle, FaTags, FaConciergeBell, FaStar,FaCheckCircle, FaBed } from "react-icons/fa"
const HotelDetailsViewCard = () => {
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [pgdetaildata, setPgdetaildata] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview'); // State for active tab
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [checkinDate, setCheckinDate] = useState(null);
  const [room, setRoom] = useState("1");

  // Refs for scrolling
  const overviewRef = useRef(null);
  const infoRef = useRef(null);
  const facilitiesRef = useRef(null);
  const reviewsRef = useRef(null);

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

  const scrollToSection = (ref, tabName) => {
    setActiveTab(tabName);
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="py-6 bg-gray-50 min-h-screen">
    {/* Fixed Top Section */}
 
  
    {/* Content Section */}
    {isLoading ? (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    ) : (
      <div className="container mx-auto bg-white shadow-xl rounded-lg p-4">
<div className="sticky top-10 z-50 bg-emerald-500 shadow-lg rounded-lg p-2">
  <div className="flex flex-wrap justify-start gap-6">

    {/* Check-in Date Input */}
    <div className="flex flex-col gap-2 w-full sm:w-96">
      <DatePicker
        selected={checkinDate}
        onChange={(date) => setCheckinDate(date)}
        placeholderText="Select a check-in date"
        className="w-full h-12 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>

    {/* Room Selection */}
    <div className="flex flex-col gap-2 w-full sm:w-96">
      <select
        id="room-select"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="w-full h-12 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      >
        <option value="" disabled>Select number of rooms</option>
        <option value="1">1 Room</option>
        <option value="2">2 Rooms</option>
        <option value="3">3 Rooms</option>
        <option value="4">4 Rooms</option>
      </select>
    </div>

    {/* Confirm Button */}
    <div className="flex flex-col gap-2 w-full sm:w-96">
      <button
        className="w-full h-12 text-lg font-medium text-white bg-gradient-to-r from-[#f27121] via-[#e94057] to-[#8a2387] rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
      >
        Book Now
      </button>
    </div>
    
  </div>
</div>




        {/* Tabs */}
        <div className="flex justify-center border-b-2 border-gray-300 pb-0 mb-6 relative">
          {[
            { name: "Overview", icon: <FaInfoCircle />, ref: overviewRef },
            { name: "Info & Prices", icon: <FaTags />, ref: infoRef },
            { name: "Facilities", icon: <FaConciergeBell />, ref: facilitiesRef },
            { name: "Reviews", icon: <FaStar />, ref: reviewsRef },
          ].map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => scrollToSection(tab.ref, tab.name)}
              className={`relative px-6 py-2 text-sm md:text-base font-medium flex items-center space-x-2 transition-all ${
                activeTab === tab.name
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              {/* Icon */}
              <span className="text-lg">{tab.icon}</span>
              {/* Label */}
              <span>{tab.name}</span>
              {/* Animated Underline */}
              {activeTab === tab.name && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>
  
        {/* Sections */}
        <div ref={overviewRef} className="mb-8">
      
          <h1 className="text-3xl font-bold flex items-center gap-2 mr-4 text-gray-900">
          <FaCheckCircle className="text-green-500 text-2xl" title="Verified" />
                {pgdetaildata.PGName}
              </h1>
              <p className="text-gray-800 font-bold text-lg flex ">  <FaMapMarkerAlt className="text-red-600 mr-1 mt-1" /> {pgdetaildata.nearby},{pgdetaildata.district}</p>


              <div className="w-full lg:w-8/10 py-4 relative">
      {/* Main Image Carousel */}
      <Carousel
        showThumbs={false}
        autoPlay
        selectedItem={currentImage}
        onChange={(index) => setCurrentImage(index)}
      >
        {selectedRoomType?.images?.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Room ${index}`}
              className="w-full h-64 lg:h-96 object-cover mx-auto rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent rounded-lg"></div>
          </div>
        ))}
      </Carousel>

      {/* Thumbnail Row */}
      <div className="flex gap-2 mt-4 overflow-x-auto">
        {selectedRoomType?.images?.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`cursor-pointer border-2 ${
              currentImage === index ? "border-blue-500" : "border-transparent"
            } rounded-lg`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index}`}
              className="w-20 h-20 object-cover rounded-lg hover:opacity-75 transition"
            />
          </div>
        ))}
      </div>
    </div>

    <p className="mt-4 text-md text-gray-900">{pgdetaildata.description}</p>

        </div>
  
        <div ref={infoRef} className="mb-8">
      

              <div className="mt-6">
  <h2 className="text-xl font-semibold text-gray-800">Availability</h2>
  <div className="mt-4 overflow-x-auto">
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800 font-semibold">Room Type</th>
          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800 font-semibold">Price (INR)</th>
          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800 font-semibold">Availability</th>
        </tr>
      </thead>
      <tbody>
        {pgdetaildata.roomTypes?.map((room, index) => (
          <tr
            key={index}
            className={`cursor-pointer transition-transform transform hover:scale-105 ${
              selectedRoomType?.type === room.type
                ? 'bg-blue-100'
                : 'bg-white'
            }`}
            onClick={() => handleRoomTypeSelect(room)}
          >
            <td className="border border-gray-300 px-4 py-2 text-gray-800">{room.type}</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-600">₹ {room.price}</td>
            <td className="border border-gray-300 px-4 py-2 text-gray-500">{room.availability} Available</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        </div>
  
        <div ref={facilitiesRef} className="mb-8">
        <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-800">Most popular facilities</h2>
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
        </div>
  
        <div ref={reviewsRef}>
          <div className='bg-black' >
        <div class="px-4 py-4 mt-8 ">
                        

                            <div class="mt-8">
                                <h3 class="text-xl font-semibold text-white">Reviews(10)</h3>

                                <div class="space-y-3 mt-4">
                                    <div class="flex items-center">
                                        <p class="text-sm text-white font-semibold">5.0</p>
                                        <svg class="w-5 fill-yellow-300 ml-1" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <div class="bg-gray-400 rounded w-full h-2 ml-3">
                                            <div class="w-2/3 h-full rounded bg-yellow-300"></div>
                                        </div>
                                        <p class="text-sm text-white font-semibold ml-3">66%</p>
                                    </div>

                                    <div class="flex items-center">
                                        <p class="text-sm text-white font-semibold">4.0</p>
                                        <svg class="w-5 fill-yellow-300 ml-1" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <div class="bg-gray-400 rounded w-full h-2 ml-3">
                                            <div class="w-1/3 h-full rounded bg-yellow-300"></div>
                                        </div>
                                        <p class="text-sm text-white font-semibold ml-3">33%</p>
                                    </div>

                                    <div class="flex items-center">
                                        <p class="text-sm text-white font-semibold">3.0</p>
                                        <svg class="w-5 fill-yellow-300 ml-1" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <div class="bg-gray-400 rounded w-full h-2 ml-3">
                                            <div class="w-1/6 h-full rounded bg-yellow-300"></div>
                                        </div>
                                        <p class="text-sm text-white font-semibold ml-3">16%</p>
                                    </div>

                                    <div class="flex items-center">
                                        <p class="text-sm text-white font-semibold">2.0</p>
                                        <svg class="w-5 fill-yellow-300 ml-1" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <div class="bg-gray-400 rounded w-full h-2 ml-3">
                                            <div class="w-1/12 h-full rounded bg-yellow-300"></div>
                                        </div>
                                        <p class="text-sm text-white font-semibold ml-3">8%</p>
                                    </div>

                                    <div class="flex items-center">
                                        <p class="text-sm text-white font-semibold">1.0</p>
                                        <svg class="w-5 fill-yellow-300 ml-1" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <div class="bg-gray-400 rounded w-full h-2 ml-3">
                                            <div class="w-[6%] h-full rounded bg-yellow-300"></div>
                                        </div>
                                        <p class="text-sm text-white font-semibold ml-3">6%</p>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-start mt-8">
                                <img src="https://readymadeui.com/team-2.webp" class="w-12 h-12 rounded-full border-2 border-white" />

                                <div class="ml-3">
                                    <h4 class="text-sm font-semibold text-white">John Doe</h4>
                                    <div class="flex space-x-1 mt-1">
                                        <svg class="w-4 fill-yellow-300" viewBox="0 0 14 13" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <svg class="w-4 fill-yellow-300" viewBox="0 0 14 13" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <svg class="w-4 fill-yellow-300" viewBox="0 0 14 13" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <svg class="w-4 fill-[#CED5D8]" viewBox="0 0 14 13" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <svg class="w-4 fill-[#CED5D8]" viewBox="0 0 14 13" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <p class="text-xs !ml-2 font-semibold text-white">2 mins ago</p>
                                    </div>
                                    <p class="text-xs mt-4 text-white">The service was amazing. I never had to wait that long for my food. The staff was friendly and attentive, and the delivery was impressively prompt.</p>
                                </div>
                            </div>

                            <button type="button" class="w-full mt-8 px-4 py-2.5 bg-transparent border border-yellow-300 text-yellow-300 font-semibold rounded">Read all reviews</button>
                        </div>
                    </div>
                    </div>
                </div>
        
      
    )}
    <ToastContainer />
  </div>
  
  
  );
};

export default HotelDetailsViewCard;
