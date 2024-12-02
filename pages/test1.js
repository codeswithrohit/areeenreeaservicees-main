import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

const PropertiesByCities = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const { location } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'yourCollectionName' with the actual collection name
        const collections = [
          'Resortdetail',
          'rentdetail',
          'pgdetail',
          'Hoteldetail',
          'buydetail',
          'Banqueethalldetail'
        ];

        const fetchPromises = collections.map(async (collectionName) => {
          const collectionRef = firebase.firestore().collection(collectionName).where('Verified', '==', 'true');
          const querySnapshot = await collectionRef.get();
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            distance: null, // Initially set distance as null
          }));
        });

        const allData = (await Promise.all(fetchPromises)).flat();

        console.log('Fetched Data:', allData);

        // Set the fetched data to the state
        setFetchedData(allData);

        // Calculate distances for each item
        const distances = await Promise.all(
          allData.map(async (item) => {
            const formattedDistance = await calculateDistance(location, item.location);
            return formattedDistance;
          })
        );

        // Update the distances in fetchedData
        const updatedData = allData.map((item, index) => ({
          ...item,
          distance: distances[index],
        }));

        // Set the updated fetched data to the state
        setFetchedData(updatedData);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData(); // Call the function to fetch data
  }, [location]);

  const calculateDistance = (location1, location2) => {
    return new Promise((resolve, reject) => {
      if (location1.trim() !== '' && location2.trim() !== '') {
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [location1],
            destinations: [location2],
            travelMode: 'DRIVING',
          },
          (response, status) => {
            if (status === 'OK' && response.rows && response.rows.length > 0 && response.rows[0].elements && response.rows[0].elements.length > 0) {
              const { distance } = response.rows[0].elements[0];
              if (distance) {
                const distanceValue = distance.value; // Distance in meters
                const distanceKm = distanceValue / 1000; // Convert distance to kilometers
                const formattedDistance = `${distance.text}`; // Construct the desired format
                console.log('Distance:', formattedDistance);
                resolve(formattedDistance);
              }
            } else {
              console.log('Error:', status);
              reject(null);
            }
          }
        );
      } else {
        console.log('Please enter both locations.');
        reject(null);
      }
    });
  };
  console.log("fetheddata",fetchedData)
  return (
    <div>
      <section>
                    <div className="max-w-[90%] lg:max-w-[85%] mx-auto my-8 md:my-12 lg:my-20">
                        <div className="text-center">
                            <p className="text-lg mb-2 text-color4">FEATURED PROPERTIES</p>
                            <p className="text-3xl font-semibold">Recommended for you</p>
                        </div>
                        <div className="w-full mx-auto mt-8">
  <div className="grid grid-cols-3 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
    <a href="" className="px-4 py-2 bg-color3 font-medium rounded-lg hover:bg-color4 hover:text-white duration-200 text-center">All</a>
    <a href="" className="px-4 py-2 bg-color3 font-medium rounded-lg hover:bg-color4 hover:text-white duration-200 text-center">ARENE PG</a>
    <a href="" className="px-4 py-2 bg-color3 font-medium rounded-lg hover:bg-color4 hover:text-white duration-200 text-center">BUY PROPERTY</a>
    <a href="" className="px-4 py-2 bg-color3 font-medium rounded-lg hover:bg-color4 hover:text-white duration-200 text-center">RENT PROPERTY</a>
    <a href="" className="px-4 py-2 bg-color3 font-medium rounded-lg hover:bg-color4 hover:text-white duration-200 text-center">ARENE HOTELS</a>
    <a href="" className="px-4 py-2 bg-color3 font-medium rounded-lg hover:bg-color4 hover:text-white duration-200 text-center">BANQUEET HALL</a>
    <a href="" className="px-4 py-2 bg-color3 font-medium rounded-lg hover:bg-color4 hover:text-white duration-200 text-center">RESORT</a>
    <a href="" className="px-4 py-2 bg-color3 font-medium rounded-lg hover:bg-color4 hover:text-white duration-200 text-center">ARENE LAUNDRY</a>
    <a href="" className="px-4 py-2 bg-color3 font-medium rounded-lg hover:bg-color4 hover:text-white duration-200 text-center">ARENE CHEF</a>
  </div>
</div>


                        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 my-10">
                            <div className="rounded-lg overflow-hidden border">
                                <div className="h-[240px] w-full">
                                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/f1/03/d9/dasashwamedh-ghat.jpg?w=1400&h=1400&s=1" alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <p className="text-xl font-semibold">Casa Lomas De Machalí Machas</p>
                                    <p className="mb-2"><i className="fa-solid fa-location-dot text-color4 me-1"></i>Jaunpur, U.P.</p>
                                    <div className="flex gap-8 text-lg">
                                        <p><i className="fa-solid fa-bed me-2"></i>3</p>
                                        <p><i className="fa-solid fa-bath me-2"></i>3</p>
                                        <p><i className="fa-solid fa-ruler me-2"></i>3</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 border-t">
                                    <div className="flex gap-2 items-center">
                                        <img src="https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH" className="w-10 h-10 rounded-full object-cover" alt="" />
                                        <p className="text-lg font-medium">John Wick</p>
                                    </div>
                                    <div>
                                        <p className="text-[24px] font-medium"><i className="fa-solid fa-indian-rupee-sign me-1"></i>15,000<span className="text-gray-400">/SQFT</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden border">
                                <div className="h-[240px] w-full">
                                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/f1/03/d9/dasashwamedh-ghat.jpg?w=1400&h=1400&s=1" alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <p className="text-xl font-semibold">Casa Lomas De Machalí Machas</p>
                                    <p className="mb-2"><i className="fa-solid fa-location-dot text-color4 me-1"></i>Jaunpur, U.P.</p>
                                    <div className="flex gap-8 text-lg">
                                        <p><i className="fa-solid fa-bed me-2"></i>3</p>
                                        <p><i className="fa-solid fa-bath me-2"></i>3</p>
                                        <p><i className="fa-solid fa-ruler me-2"></i>3</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 border-t">
                                    <div className="flex gap-2 items-center">
                                        <img src="https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH" className="w-10 h-10 rounded-full object-cover" alt="" />
                                        <p className="text-lg font-medium">John Wick</p>
                                    </div>
                                    <div>
                                        <p className="text-[24px] font-medium"><i className="fa-solid fa-indian-rupee-sign me-1"></i>15,000<span className="text-gray-400">/SQFT</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden border">
                                <div className="h-[240px] w-full">
                                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/f1/03/d9/dasashwamedh-ghat.jpg?w=1400&h=1400&s=1" alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <p className="text-xl font-semibold">Casa Lomas De Machalí Machas</p>
                                    <p className="mb-2"><i className="fa-solid fa-location-dot text-color4 me-1"></i>Jaunpur, U.P.</p>
                                    <div className="flex gap-8 text-lg">
                                        <p><i className="fa-solid fa-bed me-2"></i>3</p>
                                        <p><i className="fa-solid fa-bath me-2"></i>3</p>
                                        <p><i className="fa-solid fa-ruler me-2"></i>3</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 border-t">
                                    <div className="flex gap-2 items-center">
                                        <img src="https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH" className="w-10 h-10 rounded-full object-cover" alt="" />
                                        <p className="text-lg font-medium">John Wick</p>
                                    </div>
                                    <div>
                                        <p className="text-[24px] font-medium"><i className="fa-solid fa-indian-rupee-sign me-1"></i>15,000<span className="text-gray-400">/SQFT</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden border">
                                <div className="h-[240px] w-full">
                                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/f1/03/d9/dasashwamedh-ghat.jpg?w=1400&h=1400&s=1" alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <p className="text-xl font-semibold">Casa Lomas De Machalí Machas</p>
                                    <p className="mb-2"><i className="fa-solid fa-location-dot text-color4 me-1"></i>Jaunpur, U.P.</p>
                                    <div className="flex gap-8 text-lg">
                                        <p><i className="fa-solid fa-bed me-2"></i>3</p>
                                        <p><i className="fa-solid fa-bath me-2"></i>3</p>
                                        <p><i className="fa-solid fa-ruler me-2"></i>3</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 border-t">
                                    <div className="flex gap-2 items-center">
                                        <img src="https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH" className="w-10 h-10 rounded-full object-cover" alt="" />
                                        <p className="text-lg font-medium">John Wick</p>
                                    </div>
                                    <div>
                                        <p className="text-[24px] font-medium"><i className="fa-solid fa-indian-rupee-sign me-1"></i>15,000<span className="text-gray-400">/SQFT</span></p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden border">
                                <div className="h-[240px] w-full">
                                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/f1/03/d9/dasashwamedh-ghat.jpg?w=1400&h=1400&s=1" alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <p className="text-xl font-semibold">Casa Lomas De Machalí Machas</p>
                                    <p className="mb-2"><i className="fa-solid fa-location-dot text-color4 me-1"></i>Jaunpur, U.P.</p>
                                    <div className="flex gap-8 text-lg">
                                        <p><i className="fa-solid fa-bed me-2"></i>3</p>
                                        <p><i className="fa-solid fa-bath me-2"></i>3</p>
                                        <p><i className="fa-solid fa-ruler me-2"></i>3</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 border-t">
                                    <div className="flex gap-2 items-center">
                                        <img src="https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH" className="w-10 h-10 rounded-full object-cover" alt="" />
                                        <p className="text-lg font-medium">John Wick</p>
                                    </div>
                                    <div>
                                        <p className="text-[24px] font-medium"><i className="fa-solid fa-indian-rupee-sign me-1"></i>15,000<span className="text-gray-400">/SQFT</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <a href="#" className="text-lg font-semibold bg-color4 text-white p-4 rounded-btn hover:shadow-lg duration-200">View all properties</a>
                        </div>
                    </div>
                </section>
    </div>
  )
}

export default PropertiesByCities