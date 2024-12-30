import React from 'react';

const HeroSection = () => {
  return (
    <div>
      <section
        className="lg:py-16 py-6 relative bg-[url('https://img.freepik.com/free-vector/water-bubbles-with-sun-light-background_1017-36588.jpg?t=st=1735459064~exp=1735462664~hmac=2cfbb67520b4afe57ffb5af3e1a18883440f95919e42afd86d586b580e778a4a&w=1380')] bg-cover bg-center bg-no-repeat"
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-600/20 via-emerald-600/5 to-emerald-600/0 blur-[60px]"></div>
        
        {/* Content Container */}
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 items-center">
            
            {/* Left Content */}
            <div className="py-20 px-10">
              <div className="flex items-center justify-center lg:justify-start order-last lg:order-first">
                <div className="text-center lg:text-start">
                  <span className="inline-flex py-2 px-16 text-sm text-white font-bold rounded-full bg-primary/80 mb-0 lg:mb-2">
                    #Smart Laundry Solutions
                  </span>
                  <h1 className="lg:text-6xl/normal md:text-5xl/snug text-3xl font-bold text-default-950 capitalize mb-5">
                    Fresh, Clean, and
                    <span className="inline-flex relative">
                      <span className="ml-3">Delivered</span>
                      <img src="/circle-line.png" className="absolute -z-10 h-full w-full lg:flex hidden" />
                    </span>
                    <span className="text-emerald-800">to Your Doorstep!</span>
                  </h1>
                  <p className="text-lg text-default-700 text-white font-medium mb-8 md:max-w-md lg:mx-0 mx-auto">
                    Experience hassle-free laundry services with doorstep pickup and delivery – clean clothes, happy you!.
                  </p>
                  
                  {/* Button */}
                  <div className="flex flex-wrap items-center justify-center gap-5 mt-10">
                    <a href="/allarenelaundry">
                      <button
                        className="group relative inline-flex overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                      >
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600"></span>
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-medium backdrop-blur-3xl transition-all duration-300 group-hover:bg-slate-950/90">
                          <svg
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mr-2 h-5 w-5 text-pink-500 transition-transform duration-300 group-hover:-translate-x-1"
                          >
                            <path
                              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                              strokeWidth="2"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                            ></path>
                          </svg>
                          <span className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                            Order Now
                          </span>
                          <svg
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="ml-2 h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1"
                          >
                            <path
                              d="M13 5l7 7-7 7M5 5l7 7-7 7"
                              strokeWidth="2"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                            ></path>
                          </svg>
                        </span>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative flex items-center justify-center py-20">
              <span className="absolute top-0 start-0 text-3xl -rotate-[0deg]">
                <img src="hero1.png" className="w-24 h-24" />
              </span>
              <span className="absolute top-0 end-[10%] -rotate-12 h-14 w-14 inline-flex items-center justify-center bg-yellow-400 text-white rounded-lg">
                <i data-lucide="clock-3" className="h-6 w-6"></i>
              </span>
              <span className="absolute top-1/4 end-0 -rotate-12 h-4 w-4 inline-flex items-center justify-center bg-primary text-white rounded"></span>
              <span className="absolute bottom-0 end-0 -rotate-12 h-4 w-4 inline-flex items-center justify-center bg-primary text-white rounded-full"></span>
              <span className="absolute -bottom-16 end-1/3 text-3xl">
                <img src="hero1.png" className="w-24 h-24" />
              </span>
              <img src="/herolaundry.png" className="mx-auto" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
