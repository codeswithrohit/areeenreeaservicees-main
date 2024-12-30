import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
import { FaHome, FaBuilding, FaHotel, FaShower, FaUtensils, FaStore,FaTimes } from 'react-icons/fa';


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
      <div className="flex justify-center items-center ">
      {/* <button type="button"
        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
        Loading
        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
            clipRule="evenodd" data-original="#000000" />
        </svg> 
      </button> */}
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
    <div className="p-4 ">

      <div className="grid  w-full gap-1 grid-cols-1">
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
        {isLoaded && (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={() => onPlaceChanged(false)}
      options={{
        types: ['(regions)'],
        componentRestrictions: { country: 'IN' },
      }}
    >
      <input
        value={Location}
        placeholder="Search location"
        onChange={(e) => setLocation(e.target.value)}
        type="text"
        className="border-b-2 w-full border-[#43d3b1] outline-none text-sm font-bold text-black p-1"  />
    </Autocomplete>
  )}

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
const BuyPropertiesContent = ({setShowContent}) => {
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
      <div className="flex justify-center items-center ">
      {/* <button type="button"
        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
        Loading
        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
            clipRule="evenodd" data-original="#000000" />
        </svg> 
      </button> */}
    </div>
    );
  }
  



  
  const buyData = ['Buy Category', 'Appartment', 'Builder Floor','Villas',,'Land','Shop/Showroom','Office Space','Other Properties'];
  const handleBuySearch = () => {
    setShowContent(false);
    // Redirect to the detail page with the parameters
    router.push(`/Buy?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };
  return (
    <div className="p-4 ">

      <div className="grid  w-full gap-1 grid-cols-1">
        {/* Category Dropdown */}
        <select 
          value={category} 
          onChange={handleCategoryChange} 
          className="bg-gray-50  mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {buyData.map((categoryOption, index) => (
            <option key={index} value={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>

        {/* Location Input with Autocomplete */}
        {isLoaded && (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={() => onPlaceChanged(false)}
      options={{
        types: ['(regions)'],
        componentRestrictions: { country: 'IN' },
      }}
    >
      <input
        value={Location}
        placeholder="Search location"
        onChange={(e) => setLocation(e.target.value)}
        type="text"
        className="border-b-2 w-full border-[#43d3b1] outline-none text-sm font-bold text-black p-1"  />
    </Autocomplete>
  )}

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
          onClick={handleBuySearch} 
          className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs"
        >
          Search
        </button>
      </div>
    </div>
  );
};

const RentPropertiesContent = ({setShowContent}) => {
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
      <div className="flex justify-center items-center ">
      {/* <button type="button"
        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
        Loading
        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
            clipRule="evenodd" data-original="#000000" />
        </svg> 
      </button> */}
    </div>
    );
  }
  

  const rentData = ['Rent Category', 'Appartment', 'Builder Floor','Shop/Showroom','Office Space','Other Properties'];
  const handleRentSearch = () => {
    setShowContent(false);
    // Redirect to the detail page with the parameters
    router.push(`/Rent?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };


  

  return (
    <div className="p-4 ">

      <div className="grid  w-full gap-1 grid-cols-1">
        {/* Category Dropdown */}
        <select 
          value={category} 
          onChange={handleCategoryChange} 
          className="bg-gray-50  mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {rentData.map((categoryOption, index) => (
            <option key={index} value={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>

        {/* Location Input with Autocomplete */}
        {isLoaded && (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={() => onPlaceChanged(false)}
      options={{
        types: ['(regions)'],
        componentRestrictions: { country: 'IN' },
      }}
    >
      <input
        value={Location}
        placeholder="Search location"
        onChange={(e) => setLocation(e.target.value)}
        type="text"
        className="border-b-2 w-full border-[#43d3b1] outline-none text-sm font-bold text-black p-1"  />
    </Autocomplete>
  )}

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
          onClick={handleRentSearch} 
          className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs"
        >
          Search
        </button>
      </div>
    </div>
  );
};
const ArenaRoomContent = ({setShowContent}) => {
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
      <div className="flex justify-center items-center ">
      {/* <button type="button"
        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
        Loading
        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
            clipRule="evenodd" data-original="#000000" />
        </svg> 
      </button> */}
    </div>
    );
  }
  


  
  const handleHotelSearch = () => {
    setShowContent(false);
    // Redirect to the detail page with the parameters
    router.push(`/Hotel?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  return (
    <div className="p-4 ">

      <div className="grid  w-full gap-1 grid-cols-1">
      

        {/* Location Input with Autocomplete */}
        {isLoaded && (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={() => onPlaceChanged(false)}
      options={{
        types: ['(regions)'],
        componentRestrictions: { country: 'IN' },
      }}
    >
      <input
        value={Location}
        placeholder="Search location"
        onChange={(e) => setLocation(e.target.value)}
        type="text"
        className="border-b-2 w-full border-[#43d3b1] outline-none text-sm font-bold text-black p-1"  />
    </Autocomplete>
  )}

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
          onClick={handleHotelSearch} 
          className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs"
        >
          Search
        </button>
      </div>
    </div>
  );
};
const BanquetHallsContent = ({setShowContent}) => {
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
      <div className="flex justify-center items-center ">
      {/* <button type="button"
        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
        Loading
        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
            clipRule="evenodd" data-original="#000000" />
        </svg> 
      </button> */}
    </div>
    );
  }
  


  


  const handleBanqueetHallSearch = () => {
    setShowContent(false);
    // Redirect to the detail page with the parameters
    router.push(`/BanqueetHall?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  return (
    <div className="p-4 ">

      <div className="grid  w-full gap-1 grid-cols-1">
      

        {/* Location Input with Autocomplete */}
        {isLoaded && (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={() => onPlaceChanged(false)}
      options={{
        types: ['(regions)'],
        componentRestrictions: { country: 'IN' },
      }}
    >
      <input
        value={Location}
        placeholder="Search location"
        onChange={(e) => setLocation(e.target.value)}
        type="text"
        className="border-b-2 w-full border-[#43d3b1] outline-none text-sm font-bold text-black p-1"  />
    </Autocomplete>
  )}

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
          onClick={handleBanqueetHallSearch} 
          className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs"
        >
          Search
        </button>
      </div>
    </div>
  );
};
const ResortContent = ({setShowContent}) => {
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
      <div className="flex justify-center items-center ">
      {/* <button type="button"
        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
        Loading
        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
            clipRule="evenodd" data-original="#000000" />
        </svg> 
      </button> */}
    </div>
    );
  }
  


  const handleResortSearch = () => {
    setShowContent(false);
    // Redirect to the detail page with the parameters
    router.push(`/Resort?location=${Location}&nearestLocation=${nearestLocation}`);
  };


 
  return (
    <div className="p-4 ">

      <div className="grid  w-full gap-1 grid-cols-1">
      

        {/* Location Input with Autocomplete */}
        {isLoaded && (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={() => onPlaceChanged(false)}
      options={{
        types: ['(regions)'],
        componentRestrictions: { country: 'IN' },
      }}
    >
      <input
        value={Location}
        placeholder="Search location"
        onChange={(e) => setLocation(e.target.value)}
        type="text"
        className="border-b-2 w-full border-[#43d3b1] outline-none text-sm font-bold text-black p-1"  />
    </Autocomplete>
  )}

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
          onClick={handleResortSearch} 
          className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs"
        >
          Search
        </button>
      </div>
    </div>
  );
};
const ArenaLaundryContent = ({setShowContent}) => {
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
  

  const handleServiceChange = (e) => {
    setServices(e.target.value);
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
      <div className="flex justify-center items-center ">
      {/* <button type="button"
        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
        Loading
        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
            clipRule="evenodd" data-original="#000000" />
        </svg> 
      </button> */}
    </div>
    );
  }
  
  const handleLaundrySearch = () => {
    const nearestLocation = 10; // Setting nearestLocation to 10
    setShowContent(false);
    // Redirect to the detail page with the parameters
    router.push(`/Laundry?location=${Location}&nearestLocation=${nearestLocation}&services=${services}`);
  };



  return (
    <div className="p-4 ">

      <div className="grid  w-full gap-1 grid-cols-1">
        {/* Category Dropdown */}
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

        {/* Location Input with Autocomplete */}
        {isLoaded && (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={() => onPlaceChanged(false)}
      options={{
        types: ['(regions)'],
        componentRestrictions: { country: 'IN' },
      }}
    >
      <input
        value={Location}
        placeholder="Search location"
        onChange={(e) => setLocation(e.target.value)}
        type="text"
        className="border-b-2 w-full border-[#43d3b1] outline-none text-sm font-bold text-black p-1"  />
    </Autocomplete>
  )}

        {/* Nearest Location Dropdown */}
        {/* <select 
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
        </select> */}

        {/* Search Button */}
        <button 
          onClick={handleLaundrySearch} 
          className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs"
        >
          Search
        </button>
      </div>
    </div>
  );
};
const ArenaChefContent = ({setShowContent}) => {
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
  

  const handleServiceChange = (e) => {
    setServices(e.target.value);
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
      <div className="flex justify-center items-center ">
      {/* <button type="button"
        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
        Loading
        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
          <path fillRule="evenodd"
            d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
            clipRule="evenodd" data-original="#000000" />
        </svg> 
      </button> */}
    </div>
    );
  }
  


  const handleCloudKitchenSearch = () => {

    const nearestLocation = 10; // Setting nearestLocation to 10
    setShowContent(false);
    // Redirect to the detail page with the parameters
    router.push(`/CloudKitchen?location=${Location}&nearestLocation=${nearestLocation}&services=${services}`);
  };

  return (
    <div className="p-4 ">

      <div className="grid  w-full gap-1 grid-cols-1">
        {/* Category Dropdown */}
        <select  name="service"
        value={services}
       onChange={handleServiceChange}
        required className="border-b-2 uppercase border-[#43d3b1] text-xs p-1">
        <option value="">Select Service</option>
        <option value="chinese">Chinese</option>
      <option value="veg-thali">Veg Thali</option>
      <option value="non-veg-thali">Non-Veg Thali</option>
          </select>

        {/* Location Input with Autocomplete */}
        {isLoaded && (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={() => onPlaceChanged(false)}
      options={{
        types: ['(regions)'],
        componentRestrictions: { country: 'IN' },
      }}
    >
      <input
        value={Location}
        placeholder="Search location"
        onChange={(e) => setLocation(e.target.value)}
        type="text"
        className="border-b-2 w-full border-[#43d3b1] outline-none text-sm font-bold text-black p-1"  />
    </Autocomplete>
  )}

        {/* Nearest Location Dropdown */}
        {/* <select 
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
        </select> */}

        {/* Search Button */}
        <button 
         onClick={handleCloudKitchenSearch}
          className="bg-[#43d3b1] p-2 rounded-btn text-white text-xs"
        >
          Search
        </button>
      </div>
    </div>
  );
};

const Hometab = () => {
  const [activeTab, setActiveTab] = useState('PG');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      setActiveTab('PG');
    } else {
      setActiveTab('');
    }
  }, [router.pathname]);

  const tabs = [
    { 
      name: 'PG', 
      icon: <FaHome />, 
      component: <PGContent setShowContent={setShowContent} />, 
      title:"Your Home Away from Home",
      subtitle: "Affordable and comfortable PG accommodations for students and professionals." 
    },
    { 
      name: 'BUY PROPERTIES', 
      icon: <MdRealEstateAgent />, 
      component: <BuyPropertiesContent />, 
      title:"Invest in Your Future",
      subtitle: "Find your dream property with exclusive deals and trusted listings." 
    },
    { 
      name: 'RENT PROPERTIES', 
      icon: <FaBuilding />, 
      component: <RentPropertiesContent />, 
      title:"Find Your Ideal Rental Home",
      subtitle: "Browse a variety of rental homes, apartments, and spaces suited for every lifestyle." 
    },
    { 
      name: 'ARENA ROOM', 
      icon: <FaHotel />, 
      component: <ArenaRoomContent />, 
      title:"Stay Comfortably, Live Conveniently",
      subtitle: "Book cozy and budget-friendly rooms for your next stay" 
    },
    { 
      name: 'BANQUET HALLS', 
      icon: <FaBuilding />, 
      component: <BanquetHallsContent />, 
      title:"Make Your Event Unforgettable",
      subtitle: "Elegant banquet halls designed for weddings, parties, and corporate gatherings." 
    },
    { 
      name: 'RESORT', 
      icon: <FaStore />, 
      component: <ResortContent />, 
      title:"Escape to Paradise",
      subtitle: "Indulge in luxury and tranquility at stunning resort destinations." 
    },
    { 
      name: 'ARENA LAUNDRY', 
      icon: <FaShower />, 
      component: <ArenaLaundryContent />, 
      title:"Fresh Clothes, Fresh Day",
      subtitle: "Quick and reliable laundry services at your doorstep." 
    },
    { 
      name: 'ARENA CHEF', 
      icon: <FaUtensils />, 
      component: <ArenaChefContent />, 
      title:"Delicious Meals, Anytime, Anywhere",
      subtitle: "Experience chef-prepared gourmet meals delivered right to your doorstep." 
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (tabName) => {
    if (activeTab === tabName && showContent) {
      setShowContent(false);
      setTimeout(() => setActiveTab(null), 300);
    } else {
      setShowContent(true);
      setTimeout(() => {
        setActiveTab(tabName);
        setShowContent(true);
      }, 300);
    }
  };

  const activeTabData = tabs.find((tab) => tab.name === activeTab);

  return (
    <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white ">
      {/* Tab Header */}
      <div
  className={`bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-400 shadow-xl  left-0 right-0 z-10 transition-all duration-300 ${
    isScrolled ? '' : ''
  }`}
>
  <div className="grid grid-cols-4 -mt-8  md:grid-cols-8 lg:grid-cols-8 gap-3 py-1 px-2 overflow-x-auto">
    {tabs.map((tab) => (
      <button
        key={tab.name}
        className={`flex items-center justify-center px-3 py-2 text-sm font-bold rounded-md whitespace-nowrap transition-all duration-300 ${
          activeTab === tab.name
            ? 'bg-gradient-to-r from-white to-emerald-200 text-emerald-700 shadow-lg scale-105'
            : 'text-gray-200 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-400 hover:text-white hover:scale-105'
        }`}
        onClick={() => handleTabClick(tab.name)}
      >
     <div className="flex flex-col md:flex-row font-bold items-center space-x-2 justify-center">
  <span className="text-lg md:text-2xl lg:text-3xl">{tab.icon}</span>
  <span className="text-sm md:text-base lg:text-lg font-bold" style={{ fontSize: '0.550rem' }}>
    {tab.name}
  </span>
</div>

   

    </button>
  ))}
</div>

</div>


  
      {/* Tab Content */}
      <div
  className={`transition-all duration-500 mt-0 px-0 ${
    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  }`}
>
  {activeTabData && (
    <div className="bg-gradient-to-br from-white to-emerald-100 rounded-none shadow-lg mt-0 px-8 py-2 relative text-gray-800">
      {/* Title Section */}
      <div className="mb-1 text-start">
        <h2 className="md:text-4xl text-sm  text-transparent font-bold bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500 mb-3">
          {activeTabData.title}
        </h2>
        <h3 className="text-gray-700 md:text-xl text-xs  font-semibold mx-auto">
          {activeTabData.subtitle}
        </h3>
      </div>

      {/* Content Section */}
      <div className="border-t-2 border-emerald-300  pt-1">
        {activeTabData.component}
      </div>
    </div>
  )}
</div>

    </div>
  );
  
};


export default Hometab;
