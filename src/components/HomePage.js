import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
import { FaMapMarkerAlt } from 'react-icons/fa';
const HomeTab = () => {

  const router = useRouter();
  const [Location, setLocation] = useState('');



  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageList = [
   
    {
      id: 1,
      imageUrl: "banner1.gif",
    },
    {
      id: 2,
      imageUrl: "banner2.gif",
    },
    {
      id: 3,
      imageUrl: "banner3.png",
    },
    {
      id: 4,
      imageUrl: "banner4.png",
    },
    {
      id: 5,
      imageUrl: "banner5.png",
    },
    // {
    //   id: 3,
    //   imageUrl: "sliderf.gif",
    // },
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



  return (
    <div>
      <section id="hero" className="relative md:mt-0 mt-36 md:h-[430px] sm:h-[100px] ">
      <div className="absolute md:top-10 -top-16 left-0 ">
          <img
            src={imageList[currentImageIndex].imageUrl}
            alt={`Slide ${currentImageIndex + 1}`}
            className=" object-contain"
          />
        </div>
  {/* <div className="relative z-10 max-w-[90%] lg:max-w-[85%] mx-auto grid place-content-center h-full">
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
   


    </div>
</div>

    </div>
  </div> */}
</section>
    </div>
  )
}

export default HomeTab