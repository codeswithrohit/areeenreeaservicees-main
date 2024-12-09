import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
import { FaHome, FaBuilding, FaHotel, FaShower, FaUtensils, FaStore } from 'react-icons/fa';
import { MdRealEstateAgent } from 'react-icons/md';

const PGContent = ({setShowContent}) => {
  const router = useRouter();
  const [Location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locations, setLocations] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);

          // Fetch location name using reverse geocoding
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyAoNz2LqEAQJjrBYsVKDs6gHQpIulUslxk`)
            .then(response => response.json())
            .then(data => {
              if (data.results && data.results.length > 0) {
                // Extracting more specific address components
                const addressComponents = data.results[0].address_components;
                const cityName = addressComponents.find(component => component.types.includes('locality'));
                const stateName = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
                const countryName = addressComponents.find(component => component.types.includes('country'));

                // Constructing a more detailed location name
                const detailedLocation = [cityName, stateName, countryName]
                  .filter(component => component !== undefined)
                  .map(component => component.long_name)
                  .join(', ');

                setLocations(detailedLocation);
              } else {
                setLocations("Location not found");
              }
            })
            .catch(error => {
              console.error('Error fetching location:', error);
              setLocations("Error fetching location");
            });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);
  const [nearestLocation, setNearestLocation] = useState('');
  const [services, setServices] = useState('');

  const handleNearestLocationChange = (e) => {
    setNearestLocation(e.target.value);
  };

   const handleCategoryChange = (event) => {
     const selectedCategory = event.target.value;
     setCategory(selectedCategory);
     console.log('Selected Category:', selectedCategory);
   };

   const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAoNz2LqEAQJjrBYsVKDs6gHQpIulUslxk',
    libraries: placesLibrary,
  });
 


  const autocompleteRef = useRef();



  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };
  




  const onPlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
  
    if (autocomplete && autocomplete.getPlace) {
      const place = autocomplete.getPlace();
  
      if (place && place.formatted_address) {
        setLocation(place.formatted_address); // Update to set the full formatted address
      }
    }
  };
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
      <button type="button"
        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
        Loading
        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
            clipRule="evenodd" data-original="#000000" />
        </svg> {/* You can replace this with any loading spinner component or element */}
      </button>
    </div>
    );
  }
  


  const pgData = ['PG Category', 'Boys', 'Girls'];
  const handlePGSearch = () => {
    // Close the content when the search is initiated
    setShowContent(false);
    
    // Redirect to the detail page with the parameters
    router.push(`/pg?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };
  

  return (
    <div  className="p-4">
      <div className="grid w-full gap-1 grid-cols-1">
        {/* Category Dropdown */}
        <select 
          value={category} 
          onChange={handleCategoryChange} 
          className="bg-gray-50  mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {pgData.map((categoryOption, index) => (
            <option key={index} value={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>

        {/* Location Input with Autocomplete */}
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input type="text" value={Location}
                name="Location"
                placeholder="Search location"
                onChange={(e) => setLocation(e.target.value)}  className="border-b-2 w-full border-[#43d3b1] outline-none text-xs p-1" />
          </Autocomplete>

        {/* Nearest Location Dropdown */}
        <select 
          value={nearestLocation}
          onChange={handleNearestLocationChange}
          className="border-b-2 mb-2 h-8 border-[#43d3b1] text-md p-1"
        >
          <option value="" disabled>
            Nearest location
          </option>
          <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
        </select>

        {/* Search Button */}
        <button 
          onClick={handlePGSearch} 
          className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs"
        >
          Search
        </button>
      </div>
    </div>
  );
};

const BuyPropertiesContent = () => <div>Explore a variety of properties for sale. Find your dream home or investment opportunity.</div>;
const RentPropertiesContent = () => <div>Browse rental properties to suit your lifestyle and budget. Apartments, houses, and more!</div>;
const ArenaRoomContent = () => <div>Book luxurious arena rooms for your stay. Comfort and style at its best.</div>;
const BanquetHallsContent = () => <div>Discover perfect venues for weddings, parties, and corporate events.</div>;
const ResortContent = () => <div>Escape to our resorts for a relaxing and rejuvenating experience.</div>;
const ArenaLaundryContent = () => <div>Convenient laundry services available at your fingertips. Quality and care guaranteed.</div>;
const ArenaChefContent = () => <div>Hire professional chefs for your culinary needs. Experience gourmet dining at home.</div>;

const Hometab = () => {
  const [activeTab, setActiveTab] = useState();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const tabs = [
    { name: 'PG', icon: <FaHome />, component: <PGContent setShowContent={setShowContent} /> },
    { name: 'BUY PROPERTIES', icon: <MdRealEstateAgent />, component: <BuyPropertiesContent /> },
    { name: 'RENT PROPERTIES', icon: <FaBuilding />, component: <RentPropertiesContent /> },
    { name: 'ARENA ROOM', icon: <FaHotel />, component: <ArenaRoomContent /> },
    { name: 'BANQUET HALLS', icon: <FaBuilding />, component: <BanquetHallsContent /> },
    { name: 'RESORT', icon: <FaStore />, component: <ResortContent /> },
    { name: 'ARENA LAUNDRY', icon: <FaShower />, component: <ArenaLaundryContent /> },
    { name: 'ARENA CHEF', icon: <FaUtensils />, component: <ArenaChefContent /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTabClick = (tabName) => {
    setShowContent(false); // Hide previous content first
    setTimeout(() => {
      setActiveTab(tabName);
      setShowContent(true); // Show new content with animation
    }, 300); // Delay matches the CSS transition duration
  };

  const activeTabComponent = tabs.find((tab) => tab.name === activeTab)?.component;

  return (
    <>
    {/* Tab Header */}
    <div
      className={`bg-white shadow-md fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'top-0' : 'top-24'
      }`}
    >
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 hover:text-blue-600 hover:bg-white ${
              activeTab === tab.name
                ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => handleTabClick(tab.name)}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  
    {/* Tab Content */}
    <div
    className={`${
      showContent ? 'opacity-100 visible' : 'opacity-0 invisible'
    } transition-opacity duration-300 mt-4`} // Removed fixed position and added margin-top
  >
    <div className=" bg-white shadow-md fixed bottom-0 left-0 right-0 z-50 transition-all duration-300">
  <div className="">
    {activeTabComponent}
  </div>
  </div>
</div>


  </>
  
  );
};

export default Hometab;
