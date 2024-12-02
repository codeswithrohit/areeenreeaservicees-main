import React from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/react-splide/css';
const Propertytype = () => {
    const splide = {
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
    }
  return (
    <div>
            <section className="bg-color2 text-white">
                    <div className="max-w-[90%] lg:max-w-[85%] mx-auto py-20">
                        <div className="text-center">
                            <p>PROPERTY TYPE</p>
                            <p className="text-3xl font-semibold">Try Searching For</p>
                        </div>
                        <div className='mt-10'>
                            <Splide options={splide} extensions={{ AutoScroll }} aria-label="Client Images">
                                <SplideSlide>
                                    <a href="#" className='bg-white block p-8 rounded-lg text-center hover:bg-[#43d3b1] duration-200'>
                                        <div className='mb-4'>
                                            <i className="fa-solid fa-house me-2 text-4xl text-[#43d3b1] bg-black p-4 rounded-full"></i>
                                        </div>
                                        <p className='text-2xl mb-2'>Apartment</p>
                                        <p>234 property</p>
                                    </a>
                                </SplideSlide>
                                <SplideSlide>
                                    <a href="#" className='bg-white block p-8 rounded-lg text-center hover:bg-[#43d3b1] duration-200'>
                                        <div className='mb-4'>
                                            <i className="fa-solid fa-house me-2 text-4xl text-[#43d3b1] bg-black p-4 rounded-full"></i>
                                        </div>
                                        <p className='text-2xl mb-2'>Apartment</p>
                                        <p>234 property</p>
                                    </a>
                                </SplideSlide>
                                <SplideSlide>
                                    <a href="#" className='bg-white block p-8 rounded-lg text-center hover:bg-[#43d3b1] duration-200'>
                                        <div className='mb-4'>
                                            <i className="fa-solid fa-house me-2 text-4xl text-[#43d3b1] bg-black p-4 rounded-full"></i>
                                        </div>
                                        <p className='text-2xl mb-2'>Apartment</p>
                                        <p>234 property</p>
                                    </a>
                                </SplideSlide>
                                <SplideSlide>
                                    <a href="#" className='bg-white block p-8 rounded-lg text-center hover:bg-[#43d3b1] duration-200'>
                                        <div className='mb-4'>
                                            <i className="fa-solid fa-house me-2 text-4xl text-[#43d3b1] bg-black p-4 rounded-full"></i>
                                        </div>
                                        <p className='text-2xl mb-2'>Apartment</p>
                                        <p>234 property</p>
                                    </a>
                                </SplideSlide>
                                <SplideSlide>
                                    <a href="#" className='bg-white block p-8 rounded-lg text-center hover:bg-[#43d3b1] duration-200'>
                                        <div className='mb-4'>
                                            <i className="fa-solid fa-house me-2 text-4xl text-[#43d3b1] bg-black p-4 rounded-full"></i>
                                        </div>
                                        <p className='text-2xl mb-2'>Apartment</p>
                                        <p>234 property</p>
                                    </a>
                                </SplideSlide>
                                <SplideSlide>
                                    <a href="#" className='bg-white block p-8 rounded-lg text-center hover:bg-[#43d3b1] duration-200'>
                                        <div className='mb-4'>
                                            <i className="fa-solid fa-house me-2 text-4xl text-[#43d3b1] bg-black p-4 rounded-full"></i>
                                        </div>
                                        <p className='text-2xl mb-2'>Apartment</p>
                                        <p>234 property</p>
                                    </a>
                                </SplideSlide>
                               

                            </Splide>
                        </div>
                    </div>
                </section>
    </div>
  )
}

export default Propertytype