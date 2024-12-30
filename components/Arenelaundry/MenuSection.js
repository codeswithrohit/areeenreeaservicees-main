import React, { useState, useRef, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const MenuSection = ({ fetchData }) => {
    console.log("fetcheddata",fetchData)
  const uniqueThalis = [...new Set(fetchData.map((item) => item.service))];
  
  // Initialize activeTab with the first uniqueThali item
  const [activeTab, setActiveTab] = useState('Iron and Fold');

  useEffect(() => {
    // Log the uniqueThalis array when the component is mounted or fetchData changes
    console.log('uniquethallis', uniqueThalis);
  }, [fetchData]); // The useEffect will run whenever fetchData changes

  const activeData = fetchData.filter((data) => data.service === activeTab);
  
  // Ref for scrolling the menu items
  const scrollRef = useRef(null);

  // Scroll functionality
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300; // Adjust this value for scroll speed
      scrollRef.current.scrollLeft += scrollAmount;
    }
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
    <div>
      <section className="lg:py-16 py-6">
        <div className="container">
          <div className="grid lg:grid-cols-4 lg:gap-10 gap-6">
            <div>
              <div>
                <span className="inline-flex py-2 px-4 text-sm text-white rounded-full bg-emerald-800/80 mb-6">
                  Menu
                </span>
                <h2 className="text-3xl font-semibold text-default-900 mb-6">
                  Special Menu for you...
                </h2>
              </div>

              <div className="flex flex-wrap w-full">
                <div className="lg:h-[30rem] h-auto lg:w-full w-screen custom-scroll overflow-auto lg:mx-0 -mx-4 px-2">
                  <nav className="flex lg:flex-col gap-2" aria-label="Tabs" role="tablist">
                    {uniqueThalis.map((thaliname) => (
                      <button
                        key={thaliname}
                        type="button"
                        className={`flex p-1 ${activeTab === thaliname ? '' : ''}`}
                        onClick={() => setActiveTab(thaliname)}
                        aria-controls={`${thaliname}-menu`}
                        role="tab"
                      >
                        <span
                          className={`${
                            activeTab === thaliname
                              ? 'bg-emerald-500 text-white'
                              : 'text-default-900'
                          } flex items-center justify-start gap-4 p-3 pe-6 lg:w-2/3 w-full transition-all hover:text-emerald-500 rounded-md`}
                        >
                          <span className="text-md font-bold uppercase">{thaliname}</span>
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="relative lg:mt-24">
                <div className="bg-emerald-800/80 rounded-lg lg:pb-16">
                  <div className="lg:p-6 p-4">
                    {activeData.length > 0 ? (
                      <div id={`${activeTab}-menu`} role="tabpanel" aria-labelledby={`${activeTab}-menu-item`}>
                        <div
                          className="flex gap-4 overflow-x-auto scroll-smooth"
                          ref={scrollRef}
                        >
                          {activeData.map((data) => (
                            <div key={data.id} className="flex-shrink-0 border-l-2 border-r-2  border-white">
                              <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                <img
                                  src="https://img.freepik.com/free-photo/close-up-arranging-clothes_23-2148857479.jpg?t=st=1735460871~exp=1735464471~hmac=1fd244b6bb6e8cc77cd4a8767efac0a84c18b5e46674d44ea9ae4686faebddd4&w=2000"
                                  className="h-64 w-72 object-cover"
                                  alt={data.Foodname}
                                />
                              </div>
                              <div className="flex items-center mt-2 ml-2">
                                {renderStars(calculateAverageRating(data.reviews))}
                                <span className="ml-2 text-sm text-white font-bold">
                                  {calculateAverageRating(data.reviews)} / 5
                                </span>
                              </div>
                              <div className="px-6 py-2">
                                <h5 className="text-md font-bold text-white mb-2">{data.service}</h5>
                                <h5 className="text-xl font-semibold text-white mb-2">
                                  <span className="text-base font-medium text-white">₹</span>{' '}
                                  {data.GarmentTypes[0]?.price}/{data.GarmentTypes[0]?.noofgarments} Garments
                                </h5>
                                <a
                               href={`/arenelaundryview?id=${data.id}`}
                                  className="inline-flex items-center text-white border-b border-dashed border-white"
                                >
                                  Order Now ➢
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-white">No items found for this menu.</p>
                    )}
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div
                    onClick={() => handleScroll('left')}
                    className="swiper-button-prev h-12 w-12 flex justify-center items-center rounded-full text-white bg-emerald-800 transition-all"
                  >
                    <FiArrowLeft size={24} />
                  </div>
                  <div
                    onClick={() => handleScroll('right')}
                    className="swiper-button-next h-12 w-12 flex justify-center items-center rounded-full text-white bg-emerald-800 transition-all"
                  >
                    <FiArrowRight size={24} />
                  </div>
                </div>
                <div className="lg:flex hidden">
                  <div className="swiper-pagination !bottom-12 !start-0"></div>
                  <span className="absolute bottom-0 start-1/4 z-10">
                    <img src="/onion.png" />
                  </span>
                  <span className="absolute -bottom-12 -end-0 z-10">
                    <img src="/leaf.png" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuSection;
