import React from 'react';

const Testimonial = () => {
  return (
    <div>
      <section className="lg:py-16 py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 grid-cols-1 items-center gap-16">
            {/* Image Section */}
            <div className="relative">
              <img
                src="/testimonial-img.png"
                className="lg:w-full w-3/4 lg:mx-0 mx-auto rounded-lg shadow-lg"
                alt="Testimonial"
              />
              <div className="absolute -bottom-10 right-10">
                <div className="bg-white shadow-md rounded-lg p-4 dark:bg-gray-800">
                  <h6 className="text-base font-semibold text-gray-800 mb-2">Our Reviewers</h6>
                  <div className="flex items-center space-x-2">
                    <img
                      className="h-10 w-10 rounded-full border-2 border-gray-300"
                      src="/avatar1.png"
                      alt="Reviewer 1"
                    />
                    <img
                      className="h-10 w-10 rounded-full border-2 border-gray-300"
                      src="/avatar2.png"
                      alt="Reviewer 2"
                    />
                    <img
                      className="h-10 w-10 rounded-full border-2 border-gray-300"
                      src="/avatar3.png"
                      alt="Reviewer 3"
                    />
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-medium">
                      +12K
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Content */}
            <div>
              <span className="inline-block py-2 px-4 text-sm font-medium text-white bg-emerald-800 rounded-full">
                Testimonials
              </span>
              <h2 className="text-4xl font-bold text-gray-800 max-w-lg mt-4">
                What They Say About Us
              </h2>

              {/* Testimonials Slider */}
              <div className="mt-6">
                <div className="space-y-6">
                  {[1, 2, 3].map((review, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-sm"
                    >
                      <img
                        src={`/avatar${index + 1}.png`}
                        className="h-14 w-14 rounded-full border-2 border-gray-200"
                        alt={`Reviewer ${index + 1}`}
                      />
                      <div>
                        <h6 className="text-lg font-semibold text-gray-700 mb-1">
                          Reviewer Name {index + 1}
                        </h6>
                        <div className="flex items-center mb-3">
                          {Array(5)
                            .fill(0)
                            .map((_, starIndex) => (
                              <svg
                                key={starIndex}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="emerald-800"
                                viewBox="0 0 24 24"
                                stroke="none"
                                className="w-5 h-5"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                        </div>
                        <p className="text-gray-600 text-sm">
                          “Food is the best. Besides the many and delicious meals, the service is
                          also very good, especially the fast delivery. Highly recommend!”
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonial;
