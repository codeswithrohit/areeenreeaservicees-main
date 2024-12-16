import React, { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import Head from 'next/head';
import { FaStar } from 'react-icons/fa';
const allarenechef = () => {
  const router = useRouter(); // Initialize the router
  
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage] = useState(9); // Number of items to display per page
  const [totalItems, setTotalItems] = useState(0); // Total items count for pagination
  const [selectedThaliNames, setSelectedThaliNames] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'yourCollectionName' with the actual collection name
        const collectionRef = firebase.firestore().collection('Cloud Kitchen');
  
        // Get all documents from the collection
        const querySnapshot = await collectionRef.get();
  
        // Extract the data from the documents along with document IDs
        const data = querySnapshot.docs.map((doc) => {
          const userData = doc.data();
          return {
            id: doc.id, // Add document ID to the data
            ...userData,
            distance: null, // Initially set distance as null
          };
        });
  
        // Set the fetched data to the state
        setFetchedData(data);
        setTotalItems(data.length); 
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };
  
    fetchData(); // Call the function to fetch data
  }, []);

 


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
  const uniqueThaliNames = Array.from(
    new Set(fetchedData.map((item) => item.thaliname))
  );

  const handleThaliNameChange = (thaliName) => {
    setSelectedThaliNames((prev) =>
      prev.includes(thaliName)
        ? prev.filter((name) => name !== thaliName) // Remove if already selected
        : [...prev, thaliName] // Add if not selected
    );
  };

  // Filter data based on selected thali names
  const filteredData = fetchedData.filter((item) =>
    selectedThaliNames.length === 0 || selectedThaliNames.includes(item.thaliname)
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  console.log("Data",fetchedData)
  return (
    <div>
       <section class="lg:py-8 py-6 mt-20">
        <div class="container">
            <div class="lg:flex gap-6">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black z-50">
                <div className="spinner-border animate-spin rounded-full border-t-4 border-b-4 border-primary w-12 h-12"></div>
              </div>
            )}

                <div class="hs-overlay hs-overlay-open:translate-x-0 hidden max-w-xs lg:max-w-full lg:w-1/4 w-full -translate-x-full fixed top-0 start-0 transition-all transform h-full z-60 lg:z-auto bg-white lg:translate-x-0 lg:block lg:static lg:start-auto dark:bg-default-50" id="filter_Offcanvas" tabindex="-1">
                    <div class="flex justify-between items-center py-3 px-4 border-b border-default-200 lg:hidden">
                        <h3 class="font-medium text-default-800">
                            Filter Options
                        </h3>

                        <button class="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-default-500 hover:text-default-700 text-sm" data-hs-overlay="#filter_Offcanvas" type="button">
                            <span class="sr-only">Close modal</span>
                            <i class="h-5 w-5" data-lucide="x"></i>
                        </button>
                    </div>

                    <div className="h-[calc(100vh-128px)] overflow-y-auto lg:h-auto" data-simplebar>
                <div className="p-6 lg:p-0 divide-y divide-default-200">
                  <div>
                    <button className="hs-collapse-toggle py-4 inline-flex justify-between items-center gap-2 transition-all uppercase font-medium text-lg text-default-900 w-full open" data-hs-collapse="#all_categories" id="hs-basic-collapse" type="button">
                      Category
                    </button>
                    <div className="hs-collapse w-full overflow-hidden transition-[height] duration-300 open" id="all_categories">
                      <div className="relative flex flex-col space-y-4 mb-6">
                        {uniqueThaliNames.map((thaliName) => (
                          <div key={thaliName} className="flex items-center">
                            <input
                              className="form-checkbox rounded-full text-primary border-default-400 bg-transparent w-5 h-5 focus:ring-0 focus:ring-transparent ring-offset-0 cursor-pointer"
                              type="checkbox"
                              checked={selectedThaliNames.includes(thaliName)}
                              onChange={() => handleThaliNameChange(thaliName)}
                            />
                            <label className="ps-3 uppercase inline-flex items-center text-default-600 text-sm select-none">{thaliName}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                    <div class="block lg:hidden py-4 px-4 border-t border-default-200">
                        <a class="w-full inline-flex items-center justify-center rounded border border-primary bg-primary px-6 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary focus:ring focus:ring-primary/50" href="javascript:void(0)">Reset</a>
                    </div>
                </div>
                </div>
                </div>

                <div class="lg:w-3/4">
                

                    <div class="grid xl:grid-cols-3 sm:grid-cols-2 gap-5">
                      

                        <div class="sm:col-span-2 xl:order-2 order-1">
                            <div class="relative rounded-lg overflow-hidden bg-cover bg-[url(/discount.png)] h-full">
                                <div class="absolute inset-0 bg-black/10"></div>
                                <div class="relative p-8 md:p-12">
                                    <h4 class="text-5xl text-yellow-500 font-semibold mb-6">52% Discount</h4>
                                    <p class="text-lg text-default-500 mb-6">on your first order</p>
                                    <a class="md:mb-10 inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-primary-500" href="javascript:void(0)">
                                        Shop Now
                                        <i class="h-4 w-4" data-lucide="move-right"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        {
            currentItems.map((item) => (
                        <div  key={item.id} class="order-3 border border-default-200 rounded-lg p-4 overflow-hidden hover:border-primary hover:shadow-xl transition-all duration-300">
                            <div class="relative rounded-lg overflow-hidden divide-y divide-default-200 group">
                                <div class="mb-4 mx-auto">
                                    <img class="w-full h-full group-hover:scale-105 transition-all" src={item.image}/>
                                </div>

                                <div class="pt-2">
                                    <div class="flex items-center justify-between mb-2">
                                        <a class="text-default-800 text-xl font-semibold line-clamp-1 after:absolute after:inset-0"     href={`/arenechefview?id=${item.id}`}>{item.Foodname}</a>
                                        <i class="h-6 w-6 text-default-200 cursor-pointer hover:text-red-500 hover:fill-red-500 transition-all relative z-10" data-lucide="heart"></i>
                                    </div>
                                    <div className="flex items-center">
                                {renderStars(calculateAverageRating(item.reviews))}
                                <span className="ml-2 text-sm text-black font-bold">
                                  {calculateAverageRating(item.reviews)} / 5
                                </span>
                              </div>
                                    <div class="flex items-end justify-between mb-4">
                                    {item.Foodcharge && item.Foodcharge.length > 0 && (
                                        <h4 class="font-semibold text-md text-default-900">₹ {item.Foodcharge[0].price} - {item.Foodcharge[0].noofthalli} Plate/Thalli</h4>
                                    )}
                                        <div class="relative z-10 inline-flex justify-between border border-default-200 p-1 rounded-full">
                                            <button class="minus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center" type="button">
                                                –
                                            </button>
                                            <input class="w-8 border-0 text-sm text-center text-default-800 focus:ring-0 p-0 bg-transparent" max="100" min="0" readonly="" type="text" value="1"/>
                                            <button class="plus flex-shrink-0 bg-default-200 text-default-800 rounded-full h-6 w-6 text-sm inline-flex items-center justify-center" type="button">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <a class="relative z-0 w-full inline-flex items-center justify-center rounded-full border border-primary bg-primary px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition-all duration-500 hover:bg-primary-500" href="cart.html">Add
                                        to cart</a>
                                </div>
                            </div>
                        </div>
    ))
  }
                     

                      
                  
                    </div>

                    <div className="flex flex-wrap justify-center md:flex-nowrap md:justify-end gap-y-6 gap-x-10 pt-6">
                <nav>
                  <ul className="inline-flex items-center space-x-2 rounded-md text-sm">
                    {currentPage > 1 && (
                      <li>
                        <a
                          onClick={() => paginate(currentPage - 1)}
                          className="inline-flex items-center justify-center h-9 w-9 border border-primary rounded-full text-white bg-primary"
                        >
                          &laquo;
                        </a>
                      </li>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i + 1}>
                        <a
                          onClick={() => paginate(i + 1)}
                          className={`inline-flex items-center justify-center h-9 w-9 bg-default-100 rounded-full transition-all duration-500 ${
                            currentPage === i + 1
                              ? 'text-white bg-primary'
                              : 'text-default-800 hover:bg-primary hover:border-primary hover:text-white'
                          }`}
                        >
                          {i + 1}
                        </a>
                      </li>
                    ))}
                    {currentPage < totalPages && (
                      <li>
                        <a
                          onClick={() => paginate(currentPage + 1)}
                          className="inline-flex items-center justify-center h-9 w-9 border border-primary rounded-full text-white bg-primary"
                        >
                          &raquo;
                        </a>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
                </div>
            </div>
        </div>
    </section>
    </div>
  )
}

export default allarenechef