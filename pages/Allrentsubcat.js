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
    const { subcategory: querySubcategory } = router.query;
    const [subcategory, setSubcategory] = useState(querySubcategory || "Appartment");
    const [loading, setLoading] = useState(true);
    const [fetchedData, setFetchedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedSubcat, setSelectedSubcat] = useState(null);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState(10000);
    const [sortBy, setSortBy] = useState(null); // high-to-low or low-to-high sorting
    const [searchQuery, setSearchQuery] = useState('');
    const amenitiesList = ["WiFi", "Security", "Parking", "Aquaguard", "Food", "Laundry"];

  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Replace 'yourCollectionName' with the actual collection name
          const collectionRef = firebase.firestore().collection('rentdetail').where('subcat', '==', subcategory).where('Verified', '==', 'true');
    
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
    }, [subcategory]);
    
console.log("data",fetchedData)
const handleSearch = (query) => {
  const normalizedQuery = query.toLowerCase(); // Convert the input to lowercase
  setSearchQuery(query); // Update the state with the current input value

  const filtered = fetchedData.filter((pg) =>
    pg.location.toLowerCase().includes(normalizedQuery) ||
    pg.Propertyname.toLowerCase().includes(normalizedQuery)
  );

  setFilteredData(filtered); // Update the filtered data
};



const applyFilters = () => {
  let filtered = [...fetchedData]; // Copy the original data

  console.log("Initial fetched data:", filtered);

  // Filter by price range
  if (selectedPriceRange) {
    filtered = filtered.filter((pg) =>
      pg.propertytypes.some((room) => {
        const roomPrice = parseInt(room.price, 10); // Ensure price is treated as a number
        return roomPrice <= selectedPriceRange; // Check if the price is within the range
      })
    );
    console.log("After price range filter:", filtered);
  }

  // Optionally sort the results
  if (sortBy) {
    filtered.sort((a, b) => {
      const aPrice = parseInt(a.price, 10);
      const bPrice = parseInt(b.price, 10);
      return sortBy === "low-to-high" ? aPrice - bPrice : bPrice - aPrice;
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
setSelectedPriceRange(10000); // Reset to initial value
setSortBy(null); // Reset sorting
};
    const handleBookMeClick = (type, id) => {
   
      router.push(`/rentdetail?id=${id}`);
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
                <p className=" text-sm leading-3 text-gray-600 font-normal mb-2">HOME - <p>RENT PROPERTIES</p></p>
                <p className=" text-xs leading-4 text-gray-600 font-normal  ">Arene Services redefines the rental experience with a commitment to excellence and a focus on customer satisfaction. Our rent services stand out for their efficiency, transparency, and dedication to providing top-notch properties for our clients.</p>
                </div>
             <div className="flex items-center justify-between mt-8 p-4">
             <input
  type="text"
  className="p-2 border rounded-lg w-full max-w-md"
  placeholder="Search Properties by location"
  value={searchQuery}
  onChange={(e) => handleSearch(e.target.value)} // Pass the input value to handleSearch
/>

        <button onClick={() => setFilterModalVisible(true)} className="p-2 ml-2 text-primary">
          <FaFilter size={32} />
        </button>
      </div>

      <Modal isOpen={filterModalVisible} onRequestClose={() => setFilterModalVisible(false)} className="modal-container">
        <div className="flex justify-between  bg-black items-center p-4">
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
            <h3 className="text-md font-semibold">Price Range</h3>
            <Slider
              value={selectedPriceRange}
              onChange={(e, newValue) => setSelectedPriceRange(newValue)}
              min={1000}
              max={100000}
              step={500}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `₹${value}`}
              className="my-4"
            />
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

