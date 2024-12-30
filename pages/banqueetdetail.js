import React, { useState, useEffect, useRef } from 'react';
import { firebase } from '../Firebase/config';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { MdAttachMoney } from 'react-icons/md';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { DatePicker } from 'antd';
import {FaMapMarkerAlt, FaInfoCircle, FaTags, FaConciergeBell, FaStar,FaCheckCircle, FaBed,FaRegStar } from "react-icons/fa"
import Select from 'react-select';
import Modal from 'react-modal';

const BuyProperty = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userData, setUserData] = useState(null);
  const [Buydetaildata, setBuydetaildata] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [formLoading, setFormLoading] = useState(false); // New state for form loading
  const [activeTab, setActiveTab] = useState('Overview'); // State for active tab
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    propertyname: '',
    propertylocation: '',
    AgentId: '',
    CallBack: "No"
  });
  const overviewRef = useRef(null);
  const infoRef = useRef(null);
  const facilitiesRef = useRef(null);
  const reviewsRef = useRef(null);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
        // router.push('/signin'); // Redirect to sign-in page
      }
    });
    return () => unsubscribe();
  }, []);
  const calculateRatings = (reviews) => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRatingSum = 0;

    reviews.forEach((review) => {
      counts[review.rating] += 1;
      totalRatingSum += review.rating;
    });

    setRatingsCount(counts);
    setAverageRating(reviews.length > 0 ? (totalRatingSum / reviews.length).toFixed(1) : 0);
  };
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const fetchedUserData = userDoc.data();
        setUserData(fetchedUserData);
        setName(fetchedUserData?.name || "");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };
  const handleSubmitReview = async () => {
    if (!name || !message || !rating) {
      toast.error("Please fill out all fields and select a rating.");
      return;
    }

    const newReview = {
      name,
      message,
      rating,
      date: moment().format('YYYY-MM-DD'),
    };

    try {
      const pgId = router.query.id;
      if (!pgId) return;

      const pgRef = firebase.firestore().collection('Banqueethalldetail').doc(pgId);
      await pgRef.update({
        reviews: firebase.firestore.FieldValue.arrayUnion(newReview),
      });

      setReviews((prev) => [...prev, newReview]);
      calculateRatings([...reviews, newReview]);
      setReviewModalVisible(false);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit the review.");
    }
  };
console.log("data",Buydetaildata)
  const renderStars = (count) => (
    <div className="flex items-center space-x-1">
      {Array.from({ length: count }).map((_, idx) => (
        <FaStar key={idx} className="text-orange-500" />
      ))}
      {Array.from({ length: 5 - count }).map((_, idx) => (
        <FaRegStar key={idx} className="text-gray-400" />
      ))}
    </div>
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const db = firebase.firestore();
    const BuyRef = db.collection('Banqueethalldetail').doc(id);

    BuyRef.get().then((doc) => {
      if (doc.exists) {
        setBuydetaildata(doc.data());
        setReviews(doc.data().reviews || []); // Use pgData for reviews
        calculateRatings(doc.data().reviews || []); // Use pgData for calculating ratings
        if (doc.data().roomTypes?.length > 0) {
          setSelectedRoomType(doc.data().roomTypes[0]);
        }
      } else {
        console.log('Document not found!');
      }
      setIsLoading(false);
    });
  }, []);

  // Update formData when Buydetaildata changes
  useEffect(() => {
    if (Buydetaildata) {
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`; // Format the date and time
  
      setFormData({
        ...formData,
        propertyname: Buydetaildata?.Propertyname || '',
        propertylocation: Buydetaildata?.location || '',
        userid: user?.uid || '',
        CallBack:'NO',
        Type:'Property',
        confirmstatus:'Pending',
        AgentId: Buydetaildata?.AgentId || '',
        enquiryDate: formattedDate // Set the current date and time
      });
    }
  }, [Buydetaildata]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleRoomTypeSelect = (selectedOption) => {
    setSelectedRoomType(selectedOption); // Update the state with the selected room type
  };
  const scrollToSection = (ref, tabName) => {
    setActiveTab(tabName);
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const db = firebase.firestore();
      await db.collection('PropertyData').add(formData);
      toast.success('Enquiry submitted successfully!');
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast.error('Error submitting reservation. Please try again later.');
    }

    setFormLoading(false);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const getDescription = () => {
    const words = Buydetaildata.description?.split(' ');
    if (!words) return '';
    if (isDescriptionExpanded) return Buydetaildata.description;
    return words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '');
  };

  return (
    <div className="py-2 bg-gray-50 min-h-screen">
    {/* Fixed Top Section */}
 
  
    {/* Content Section */}
    {isLoading ? (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    ) : (
      <div className="container mx-auto bg-white shadow-xl rounded-lg p-4">
            <div className="fixed bottom-16 z-30  -right-4 px-4">
<button   onClick={() => setShowModal(true)}
  class="relative rounded-full bg-blue-500 px-4 py-2 font-mono font-bold text-white transition-colors duration-300 ease-linear before:absolute before:right-1/2 before:top-1/2 before:-z-[1] before:h-3/4 before:w-2/3 before:origin-bottom-left before:-translate-y-1/2 before:translate-x-1/2 before:animate-ping before:rounded-full before:bg-blue-500 hover:bg-blue-700 hover:before:bg-blue-700"
>
ENQUIRE NOW
</button>

       
      </div>
      {showModal && (
  <div className="fixed top-24 right-0 z-30 w-96 h-full bg-emerald-500 shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
  <div className="relative h-full flex flex-col">
  <button
      onClick={() => setShowModal(false)}
      className="absolute top-0 text-xl right-4 text-white bg-red-500 rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
    >
      &times;
    </button>
    <div className="flex mt-12  gap-2 w-full">
      <div className="w-full sm:w-1/2">
        <input 
          type="text" 
          name="name" 
          placeholder="Your Name" 
          onChange={handleChange}
          className="w-full h-12 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
        />
      </div>
      <div className="w-full sm:w-1/2">
        <input 
          type="text" 
          name="phone" 
          placeholder="Your Phone" 
          onChange={handleChange}
          className="w-full h-12 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
        />
      </div>
    </div>


    <div className="w-full mt-8">
      <button
        type="submit" 
        disabled={formLoading} 
        onClick={handleSubmit}
        className="w-full h-12 text-lg font-medium text-white bg-gradient-to-r from-[#f27121] via-[#e94057] to-[#8a2387] rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
      >
        {formLoading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  </div>
</div>

      )}



        {/* Tabs */}
        <div className="flex flex-row justify-start md:mt-8 border-b-2 border-gray-300 pb-0 mb-6 relative overflow-x-auto space-x-4 md:space-x-6">
  {[
    { name: "Overview", icon: <FaInfoCircle />, ref: overviewRef },
    { name: "Prices", icon: <FaTags />, ref: infoRef },
    { name: "Facilities", icon: <FaConciergeBell />, ref: facilitiesRef },
    { name: "Reviews", icon: <FaStar />, ref: reviewsRef },
  ].map((tab, index) => (
    <button
      key={tab.name}
      onClick={() => scrollToSection(tab.ref, tab.name)}
      className={`relative px-4 py-2 text-sm md:text-base font-medium flex flex-col items-center md:space-x-3 space-x-1 space-y-2 md:space-y-0 transition-all ${
        activeTab === tab.name
          ? "bg-blue-100 text-blue-600 font-semibold rounded-lg shadow-md"
          : "text-gray-500 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
      }`}
    >
      {/* Icon */}
      <span className="text-2xl md:text-3xl">{tab.icon}</span>
      {/* Label */}
      <span className="text-xs md:text-sm font-bold text-center">{tab.name}</span>
      {/* Animated Underline */}
      {activeTab === tab.name && (
        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 transition-all duration-300"></span>
      )}
    </button>
  ))}
</div>
  
        {/* Sections */}
        <div ref={overviewRef} className="mb-8">
      
        <h1 className="md:text-3xl text-xl font-bold flex items-center gap-2 mr-4 text-gray-900">
        <FaCheckCircle className="text-green-500 text-xl md:text-2xl" title="Verified" />
                {Buydetaildata.BanqueethallName}
              </h1>
              <p className="text-gray-900 font-bold md:text-lg text-xs flex ml-4 ">  <FaMapMarkerAlt className="text-red-600 mr-1 mt-1" /> {Buydetaildata.nearby},{Buydetaildata.district}</p>


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

    <p className="mt-4 text-md text-gray-900">{Buydetaildata.description}</p>

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
        {Buydetaildata.roomTypes?.map((room, index) => (
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
                  {Buydetaildata.benefits?.map((benefit, index) => (
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
          <div className="my-6 p-4">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => setReviewModalVisible(true)}
            >
              Submit Your Review
            </button>
            

            {reviews.map((review, idx) => (
            <div key={idx} class="flex items-start mt-2 px-4 py-2">
                                <img src="https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg" class="w-12 h-12 rounded-full border-2 border-white" />
                                <div class="ml-3">
                                    <h4 class="text-sm font-bold text-white">{review.name} ({review.date}) </h4>
                                    <p>{renderStars(review.rating)}</p>
                                    <p class="text-xs text-white mt-1">{review.message}</p>
                                </div>
                            </div>
                                 ))}
          </div>
               </div>
                    </div>
                </div>
        
      
    )}

<Modal
        isOpen={reviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
        contentLabel="Submit Review"
        className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Submit Your Review</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <textarea
          placeholder="Your Review"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        ></textarea>
        <div className="mb-4">
          <span className="font-bold">Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`inline text-xl cursor-pointer ${
                star <= rating ? "text-orange-500" : "text-gray-400"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
          onClick={handleSubmitReview}
        >
          Submit
        </button>
      </Modal>
    <ToastContainer />
  </div>
  );
};

export default BuyProperty;
