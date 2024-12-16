import React,{useState,useEffect,useRef} from 'react'
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaPersonCircleCheck } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import Modal from "react-modal"; // Corrected import
import { FaFilter, FaArrowUp, FaArrowDown, FaMale, FaFemale, FaBed, FaRegWindowMaximize, FaWindowClose,FaMapMarkerAlt,FaStar  } from "react-icons/fa";
import Slider from '@mui/material/Slider';

const Filter1 = () => {




  
  
  

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [fetchedData, setFetchedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedSubcat, setSelectedSubcat] = useState(null);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState(5000);
    const [sortBy, setSortBy] = useState(null); // high-to-low or low-to-high sorting
    const [searchQuery, setSearchQuery] = useState('');
    const amenitiesList = ["WiFi", "Security", "Parking", "Aquaguard", "Food", "Laundry"];

  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Replace 'yourCollectionName' with the actual collection name
          const collectionRef = firebase.firestore().collection('pgdetail').where('Verified', '==', 'true').where('subcat', '==', 'Boys');
    
          // Get all documents from the collection
          const querySnapshot = await collectionRef.get();
    
          // Extract the data from the documents along with document IDs
          const data = querySnapshot.docs.map((doc) => {
            const userData = doc.data();
            return {
              id: doc.id, // Add document ID to the data
              ...userData,
            };
          });
    
          // Set the fetched data to the state
          setFetchedData(data);
          setFilteredData(data);
          setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
          console.error('Error fetching data:', error);
        
          setLoading(false); // Set loading to false in case of error
        }
      };
    
      fetchData(); // Call the function to fetch data
    }, []);
    
console.log("data",fetchedData)
const handleSearch = (query) => {
  const normalizedQuery = query.toLowerCase(); // Convert the input to lowercase
  setSearchQuery(query); // Update the state with the current input value

  const filtered = fetchedData.filter((pg) =>
    pg.location.toLowerCase().includes(normalizedQuery) ||
    pg.PGName.toLowerCase().includes(normalizedQuery)
  );

  setFilteredData(filtered); // Update the filtered data
};



const applyFilters = () => {
  let filtered = [...fetchedData]; // Copy the original data
  console.log("Initial fetched data:", filtered);

  // Filter by subcategory (Boys/Girls)
  if (selectedSubcat) {
    filtered = filtered.filter(pg => pg.subcat === selectedSubcat);
    console.log("After subcategory filter:", filtered);
  }

  // Filter by room type (Single, Double, etc.)
  if (selectedRoomType) {
    filtered = filtered.filter(pg => pg.roomTypes.some(room => room.type === selectedRoomType));
    console.log("After room type filter:", filtered);
  }

  // Filter by amenities
  if (selectedAmenities.length > 0) {
    filtered = filtered.filter(pg =>
      selectedAmenities.every(amenity => pg.benefits.includes(amenity))
    );
    console.log("After amenities filter:", filtered);
  }

  // Filter by price range
  if (selectedPriceRange) {
    filtered = filtered.filter(pg =>
      pg.roomTypes.some(room => {
        const roomPrice = parseInt(room.price, 10); // Ensure price is treated as a number
        return roomPrice <= selectedPriceRange; // Compare with the selected price range
      })
    );
    console.log("After price range filter:", filtered);
  }

  // Optionally sort the results
  if (sortBy) {
    filtered.sort((a, b) => {
      const aPrice = Math.min(...a.roomTypes.map(room => parseInt(room.price, 10)));
      const bPrice = Math.min(...b.roomTypes.map(room => parseInt(room.price, 10)));
      return sortBy === 'low-to-high' ? aPrice - bPrice : bPrice - aPrice;
    });
    console.log("After sorting:", filtered);
  }

  setFilteredData(filtered);
  setFilterModalVisible(false);
};



const resetFilters = () => {
setSelectedSubcat(null);
setSelectedRoomType(null);
setSelectedAmenities([]);
setSelectedPriceRange(5000); // Reset to initial value
setSortBy(null); // Reset sorting
};
    const handleBookMeClick = (type, id) => {
   
      router.push(`/pgdetail?id=${id}`);
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

      <div className="px-8 min-h-screen ">
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAoNz2LqEAQJjrBYsVKDs6gHQpIulUslxk&libraries=places`}
          async
          defer
        ></script>
        
      </Head>
        <div className="2xl:container 2xl:mx-auto">
            <div className=" md:mt-16 lg:px-20 md:px-6 mt-9 px-4">
                <p className=" text-sm leading-3 text-gray-600 font-normal mb-2">Home - <p>PG</p></p>
                <p className=" text-xs leading-4 text-gray-600 font-normal mb-2">Arene Services revolutionizes the PG experience for boys and girls across India by offering a no-brokerage solution with exceptional properties and high-quality services. Our PG accommodations are designed to provide a seamless living experience, ensuring comfort, convenience, and a sense of community.
With Arene Services, residents can enjoy a range of amenities including water purifiers for clean drinking water, convenient locations for easy access, parking facilities for added convenience, high-speed Wi-Fi connectivity, laundry services for hassle-free living, and delicious food options to cater to diverse tastes.
Our commitment to excellence extends beyond just providing accommodation; we strive to create a welcoming environment where residents feel at home. Whether you are a student, working professional, or someone seeking a comfortable living space, Arene Services offers premium PG services that prioritize your comfort and well-being.
Experience the difference with Arene Services - where quality meets convenience, and your satisfaction is our priority. Join us today and discover the perfect PG solution tailored to meet your needs across India.</p>
             </div>
             <div className="flex items-center justify-between mt-8 p-4">
             <input
  type="text"
  className="p-2 border rounded-lg w-full max-w-md"
  placeholder="Search PG by location"
  value={searchQuery}
  onChange={(e) => handleSearch(e.target.value)} // Pass the input value to handleSearch
/>

        <button onClick={() => setFilterModalVisible(true)} className="p-2 ml-2 text-primary">
          <FaFilter size={32} />
        </button>
      </div>

      <Modal isOpen={filterModalVisible} onRequestClose={() => setFilterModalVisible(false)}  className="modal-container mt-4 fixed inset-0 bg-white overflow-y-auto">
        <div className="flex justify-between   bg-black items-center p-4">
          <button onClick={() => setFilterModalVisible(false)} className="text-red-500">
            <FaWindowClose size={32} />
          </button>
          <h2 className="text-lg font-semibold text-white ">Filters</h2>
        </div>

        <div className="p-4 bg-white">
          <div>
            <h3 className="text-md font-semibold">Sort By</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setSortBy("low-to-high")}
                className={`flex items-center gap-2 p-2 rounded-lg ${sortBy === "low-to-high" ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <FaArrowUp size={20} />
                <span>Price Low to High</span>
              </button>
              <button
                onClick={() => setSortBy("high-to-low")}
                className={`flex items-center gap-2 p-2 rounded-lg ${sortBy === "high-to-low" ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <FaArrowDown size={20} />
                <span>Price High to Low</span>
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold">Boys/Girls</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedSubcat("Boys")}
                className={`flex items-center gap-2 p-2 rounded-lg ${selectedSubcat === "Boys" ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <FaMale size={20} />
                <span>Boys</span>
              </button>
              {/* <button
                onClick={() => setSelectedSubcat("Girls")}
                className={`flex items-center gap-2 p-2 rounded-lg ${selectedSubcat === "Girls" ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <FaFemale size={20} />
                <span>Girls</span>
              </button> */}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold">Room Type</h3>
            <div className="flex gap-4 flex-wrap">
              {["Single Room", "Double Sharing Room", "Triple Sharing Room", "Single Ac Room", "Double Sharing Ac Room", "Triple Sharing Ac Room"].map(room => (
                <button
                  key={room}
                  onClick={() => setSelectedRoomType(room)}
                  className={`flex items-center gap-2 p-2 rounded-lg ${selectedRoomType === room ? "bg-primary text-white" : "bg-gray-200"}`}
                >
                  <FaBed size={20} />
                  <span>{room}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold">Price Range</h3>
            <Slider
              value={selectedPriceRange}
              onChange={(e, newValue) => setSelectedPriceRange(newValue)}
              min={1000}
              max={10000}
              step={500}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `₹${value}`}
              className="my-4"
            />
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold">Amenities</h3>
            <div className="flex gap-4 flex-wrap">
              {amenitiesList.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => {
                    if (selectedAmenities.includes(amenity)) {
                      setSelectedAmenities(prev => prev.filter(item => item !== amenity));
                    } else {
                      setSelectedAmenities(prev => [...prev, amenity]);
                    }
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg ${selectedAmenities.includes(amenity) ? "bg-primary text-white" : "bg-gray-200"}`}
                >
                  <FaRegWindowMaximize size={20} />
                  <span>{amenity}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button onClick={applyFilters} className="p-2 bg-primary text-white rounded-lg w-full">
              Apply Filters
            </button>
            <button onClick={resetFilters} className="p-2 bg-gray-500 text-white rounded-lg w-full">
              Reset
            </button>
          </div>
        </div>
      </Modal>
             </div>
             {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="loader border-t-4 border-teal-500 rounded-full w-10 h-10 animate-spin"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-gray-600">No properties available .</p>
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
    );
};

export default Filter1;

