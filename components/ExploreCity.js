import React from 'react';
import { useRouter } from 'next/router';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/react-splide/css';

const data = [
  {
    src: "https://img.freepik.com/premium-vector/outline-delhi-skyline-with-blue-landmarks-copy-space_119523-107.jpg?w=740",
    location: "Delhi",
  },
  {
    src: "https://img.freepik.com/free-vector/indian-gate-temple-with-flag_25030-39368.jpg?t=st=1721472218~exp=1721475818~hmac=bc326a3d73bcea50a6fbd808ad8406bd55ed3322f05cb37fe6333bbd8992667a&w=740",
    location: "Mumbai",
  },
  {
    src: "https://img.freepik.com/free-vector/bangalore-india-skyline-with-panorama-white-background-vector-illustration-business-travel-tourism-concept-with-modern-buildings-image-presentation-banner-website_596401-365.jpg?t=st=1721472434~exp=1721476034~hmac=3a1e03e90f45d77f9cd7f7c49597207b89b18c3d48bec23c70d54e9665206d69&w=826",
    location: "Bangalore",
  },
  {
    src: "https://img.freepik.com/free-vector/city-landmarks-background-video-calls_23-2148635605.jpg?t=st=1721481219~exp=1721484819~hmac=6bb6f4fdd6b96512e1b910c8b179dea36ae3df6410a9a04ac8cbad1a698d4c58&w=740",
    location: "Gurgaon",
  },
  {
    src: "https://img.freepik.com/premium-vector/patna-india-city-skyline-silhouette-hand-drawn-sketch_119523-10905.jpg?w=740",
    location: "Patna",
  },
  {
    src: "https://img.freepik.com/free-vector/shiny-exterior-modern-skyline-building-background-with-reflection-effect_1017-44214.jpg?t=st=1721481325~exp=1721484925~hmac=a2fedbd3a418e227c9fc356c3a19833e6e23de95a6992f9e282d405dbf85335e&w=740",
    location: "Noida",
  },
];

const Explorecity = () => {
  const splideOptions = {
    type: 'loop',
    focus: 'center',
    perPage: 1,
    autoplay: false,
    autoWidth: true,
    height: '220px',
    gap: '2rem',
    autoStart: true,
    autoScroll: {
      pauseOnHover: true,
    },
    pagination: false,
    arrows: false,
  };

  const router = useRouter();

  const handleLocationClick = (location) => {
    router.push({
      pathname: '/propertiesbycities',
      query: { location },
    });
  };

  return (
    <section>
      <div className="max-w-[90%] lg:max-w-[85%] mx-auto my-1 md:my-1 lg:my-2">
        <div className="flex flex-col lg:flex-row md:flex-row justify-between">
          <div>
            <p className="text-lg mb-2 text-[#43d3b1]">EXPLORE CITIES</p>
            <p className="text-3xl font-semibold">Properties By Cities</p>
          </div>
          {/* <div>
            <a href="#" className="border-b-2 border-[#43d3b1] pb-1">
              View all Properties
              <i className="fa-solid fa-angle-right ms-1 text-[#43d3b1]"></i>
            </a>
          </div> */}
        </div>
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <Splide options={splideOptions} extensions={{ AutoScroll }} aria-label="City Images">
            {data.map((item, index) => (
              <SplideSlide key={index}>
                <div
                  onClick={() => handleLocationClick(item.location)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <img
                    className="object-cover w-28 h-28 mb-2 rounded-full shadow"
                    src={item.src}
                    alt={item.location}
                  />
                  <p className="text-lg font-bold">{item.location}</p>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
      </div>
    </section>
  );
};

export default Explorecity;
