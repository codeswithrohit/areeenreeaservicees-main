import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
import { FaMapMarkerAlt } from 'react-icons/fa';
const HomeTab = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const router = useRouter();
  const [Location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const handleTabClick = (tab) => {
    setActiveTab(tab);


    
  };


  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageList = [
   
    {
      id: 1,
      imageUrl: "slidera.gif",
    },
    {
      id: 2,
      imageUrl: "sliderb.gif",
    },
    {
      id: 3,
      imageUrl: "sliderc.gif",
    },
    {
      id: 3,
      imageUrl: "sliderd.gif",
    },
    {
      id: 3,
      imageUrl: "slidere.gif",
    },
    {
      id: 3,
      imageUrl: "sliderf.gif",
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change the interval as needed

    return () => clearInterval(intervalId);
  }, [currentImageIndex]);

 
 
  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };


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
  const [subservices, setSubservices] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0); 
  const images = [
    "https://www.easiui.com/hero-section/image/hero17.png",
  ];

  // Function to handle automatic image slider
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(intervalId);
  }, [images.length]);
  const handleNearestLocationChange = (e) => {
   setNearestLocation(e.target.value);
 };
  const handleServiceChange = (e) => {
   setServices(e.target.value);
 };
  const handleSubsevicesChange = (e) => {
   setSubservices(e.target.value);
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

  const buyData = ['Buy Category', 'Appartment', 'Builder Floor','Villas',,'Land','Shop/Showroom','Office Space','Other Properties'];
  const handleBuySearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Buy?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };


  const pgData = ['PG Category', 'Boys', 'Girls'];
  const handlePGSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/pg?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };


  const rentData = ['Rent Category', 'Appartment', 'Builder Floor','Shop/Showroom','Office Space','Other Properties'];
  const handleRentSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Rent?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };


  const handleHotelSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Hotel?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  const handleBanqueetHallSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/BanqueetHall?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  const handleResortSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Resort?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  const handleLaundrySearch = () => {
    const nearestLocation = 10; // Setting nearestLocation to 10
    // Redirect to the detail page with the parameters
    router.push(`/Laundry?location=${Location}&nearestLocation=${nearestLocation}&services=${services}`);
  };
  const handleCloudKitchenSearch = () => {
    const nearestLocation = 10; // Setting nearestLocation to 10
    // Redirect to the detail page with the parameters
    router.push(`/CloudKitchen?location=${Location}&nearestLocation=${nearestLocation}&services=${services}`);
  };

  return (
    <div>
      <section id="hero" className="relative h-[430px] mt-16">
  <video
    className="absolute top-0 left-0 w-full h-full object-cover"
    style={{ objectFit: 'cover' }} // Ensures the video covers the entire area without being cut off
    src="home.mp4"
    autoPlay
    loop
    muted
  />
  <div className="relative z-10 max-w-[90%] lg:max-w-[85%] mx-auto grid place-content-center h-full">
    <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-1 gap-8 place-content-center">
      <div>
        <h1 className='md:text-4xl text-xl font-bold font-mono text-center text-pink-600 mt-2'> Discover your perfect stay around the India</h1>
        <div className="flex justify-center">
      <h2 className="text-xl flex items-center space-x-2">
        <FaMapMarkerAlt className="text-red-500" />
        <span className="text-red-500 font-bold font-mono" >{locations}</span>
      </h2>
    </div>
      </div>
      <div>
      <div>
      {/* <div role="tablist" className="grid grid-cols-2 -mt-4  md:grid-cols-4 lg:grid-cols-8 border-b border-gray-300">
       
        <button
          className={`flex-1 p-1 text-xs font-mono font-bold text-center ${activeTab === 'tab1' ? 'bg-[#43d3b1] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('tab1')}
        >
          ARENE PG
        </button>
        <button
          className={`flex-1 p-1 text-[12px] font-mono font-bold font-bold text-center ${activeTab === 'tab2' ? 'bg-[#43d3b1] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('tab2')}
        >
          BUY PROPERTY
        </button>
        <button
          className={`flex-1 p-1 text-xs font-mono font-bold text-center ${activeTab === 'tab3' ? 'bg-[#43d3b1] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('tab3')}
        >
          RENT PROPERTY
        </button>
        <button
          className={`flex-1 p-1 text-xs font-mono font-bold text-center ${activeTab === 'tab4' ? 'bg-[#43d3b1] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('tab4')}
        >
         ARENE ROOM
        </button>
        <button
          className={`flex-1 p-1 text-xs font-mono font-bold text-center ${activeTab === 'tab5' ? 'bg-[#43d3b1] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('tab5')}
        >
          BANQUEET HALL
        </button>
        <button
          className={`flex-1 p-1 text-xs font-mono font-bold text-center ${activeTab === 'tab6' ? 'bg-[#43d3b1] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('tab6')}
        >
          RESORT
        </button>
        <button
          className={`flex-1 p-1 text-xs font-mono font-bold text-center ${activeTab === 'tab7' ? 'bg-[#43d3b1] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('tab7')}
        >
          ARENE LAUNDRY
        </button>
        <button
          className={`flex-1 p-1 text-xs font-mono font-bold text-center ${activeTab === 'tab8' ? 'bg-[#43d3b1] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('tab8')}
        >
          ARENE CHEF
        </button>
      </div> */}


      {/* Tab Panels */}
      {/* <div role="tabpanel" className={`tab-content ${activeTab === 'tab1' ? 'block' : 'hidden'} bg-base-100 border-base-300 rounded-b-md p-4`}>
        <div className="grid gap-2 grid-cols-1">
          <select  value={category}
              onChange={handleCategoryChange}
              name=""
              id="" className="border-b-2 border-[#43d3b1] text-xs p-1">
            {pgData.map((categoryOption, index) => (
                <option key={index} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
          </select>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input type="text" value={Location}
                name="Location"
                placeholder="Search location"
                onChange={(e) => setLocation(e.target.value)}  className="border-b-2 w-full border-[#43d3b1] outline-none text-xs p-1" />
          </Autocomplete>
          <select   value={nearestLocation}
              onChange={handleNearestLocationChange}
              name=""
              id="" className="border-b-2 border-[#43d3b1] text-xs p-1">
             <option value="" disabled selected>
                Nearest location
              </option>
              <option value="2">Nearest 2 Km</option>
              <option value="4">Nearest 4 Km</option>
              <option value="6">Nearest 6 Km</option>
              <option value="8">Nearest 8 Km</option>
              <option value="10">Nearest 10 Km</option>
          </select>
          <button        onClick={handlePGSearch} className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs">Search</button>
        </div>
      </div>

      <div role="tabpanel" className={`tab-content ${activeTab === 'tab2' ? 'block' : 'hidden'} bg-base-100 border-base-300 rounded-b-md p-4`}>
        <div className="grid gap-2 grid-cols-1">
          <select value={category} onChange={handleCategoryChange} name="" id="" className="border-b-2 border-[#43d3b1] text-xs p-1">
          {buyData.map((categoryOption, index) => (
                <option key={index} value={categoryOption}>
                {categoryOption}
                </option>
              ))}
          </select>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input type="text" value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="border-b-2 w-full border-[#43d3b1] outline-none text-xs p-1" />
          </Autocomplete>
          <select value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="border-b-2 border-[#43d3b1] text-xs p-1">
           <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
          </select>
          <button onClick={handleBuySearch} className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs">Search</button>
        </div>
      </div>

      <div role="tabpanel" className={`tab-content ${activeTab === 'tab3' ? 'block' : 'hidden'} bg-base-100 border-base-300 rounded-b-md p-4`}>
        <div className="grid gap-2 grid-cols-1">
          <select value={category} onChange={handleCategoryChange} name="" id="" className="border-b-2 border-[#43d3b1] text-xs p-1">
          {rentData.map((categoryOption, index) => (
              <option key={index} value={categoryOption}>
              {categoryOption}
              </option>
            ))}
          </select>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input type="text" value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="border-b-2 w-full border-[#43d3b1] outline-none text-xs p-1" />
          </Autocomplete>
          <select value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="border-b-2 border-[#43d3b1] text-xs p-1">
           <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
          </select>
          <button onClick={handleRentSearch} className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs">Search</button>
        </div>
      </div>

      <div role="tabpanel" className={`tab-content ${activeTab === 'tab4' ? 'block' : 'hidden'} bg-base-100 border-base-300 rounded-b-md p-4`}>
        <div className="grid gap-2 grid-cols-1">
         
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input type="text" value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="border-b-2 w-full border-[#43d3b1] outline-none text-xs p-1" />
          </Autocomplete>
          <select value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="border-b-2 border-[#43d3b1] text-xs p-1">
           <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
          </select>
          <button onClick={handleHotelSearch} className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs">Search</button>
        </div>
      </div>

      <div role="tabpanel" className={`tab-content ${activeTab === 'tab5' ? 'block' : 'hidden'} bg-base-100 border-base-300 rounded-b-md p-4`}>
        <div className="grid gap-2 grid-cols-1">
         
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input type="text" value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="border-b-2 w-full border-[#43d3b1] outline-none text-xs p-1" />
          </Autocomplete>
          <select value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="border-b-2 border-[#43d3b1] text-xs p-1">
           <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
          </select>
          <button onClick={handleBanqueetHallSearch} className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs">Search</button>
        </div>
      </div>

      <div role="tabpanel" className={`tab-content ${activeTab === 'tab6' ? 'block' : 'hidden'} bg-base-100 border-base-300 rounded-b-md p-4`}>
        <div className="grid gap-2 grid-cols-1">
         
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input type="text" value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="border-b-2 w-full border-[#43d3b1] outline-none text-xs p-1" />
          </Autocomplete>
          <select value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="border-b-2 border-[#43d3b1] text-xs p-1">
           <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
          </select>
          <button onClick={handleResortSearch} className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs">Search</button>
        </div>
      </div> */}

      {/* <div role="tabpanel" className={`tab-content ${activeTab === 'tab7' ? 'block' : 'hidden'} bg-base-100 border-base-300 rounded-b-md p-4`}>
        <div className="grid gap-2 grid-cols-1">
          <select  name="service"
        value={services}
       onChange={handleServiceChange}
        required className="border-b-2 border-[#43d3b1] text-xs p-1">
         <option value="">Select Service</option>
        <option value="Iron and Fold">Iron & Fold</option>
        <option value="Wash and Iron">Wash & Iron</option>
        <option value="Wash and Fold">Wash & Fold</option>
        <option value="Dry Cleaning">Dry Cleaning</option>
        <option value="Emergency Service">Emergency Service</option>
        <option value="Subscription Based">Subscription Based</option>
          </select>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input type="text" value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="border-b-2 w-full border-[#43d3b1] outline-none text-xs p-1" />
          </Autocomplete>
         
          <button onClick={handleLaundrySearch} className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs">Search</button>
        </div>
      </div>

      <div role="tabpanel" className={`tab-content ${activeTab === 'tab8' ? 'block' : 'hidden'} bg-base-100 border-base-300 rounded-b-md p-4`}>
        <div className="grid gap-2 grid-cols-1">
          <select  name="service"
        value={services}
       onChange={handleServiceChange}
        required className="border-b-2 uppercase border-[#43d3b1] text-xs p-1">
        <option value="">Select Service</option>
        <option value="chinese">Chinese</option>
      <option value="veg-thali">Veg Thali</option>
      <option value="non-veg-thali">Non-Veg Thali</option>
          </select>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input type="text" value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="border-b-2 w-full border-[#43d3b1] outline-none text-xs p-1" />
          </Autocomplete>
         
          <button  onClick={handleCloudKitchenSearch} className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs">Search</button>
        </div>
      </div> */}


    </div>
</div>

    </div>
  </div>
</section>
    </div>
  )
}

export default HomeTab