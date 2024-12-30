import React from 'react'

const HeroSection = () => {
  return (
    <div>
          <section
        className="lg:py-16 py-6 relative bg-[url('https://img.freepik.com/free-photo/top-view-circular-food-frame_23-2148723455.jpg?t=st=1735458622~exp=1735462222~hmac=f3cc0e97c64596a1cd1fa99fef2415db4f372aeee41b37016dbaa36edc751305&w=2000')] bg-cover bg-center bg-no-repeat"
      >
        <div class="absolute inset-0 blur-[60px] bg-gradient-to-l from-emerald-600/20 via-emerald-600/5 to-emerald-600/0"></div>
        <div class="container relative">
            <div class="grid lg:grid-cols-2 items-center">
                <div class="py-20 px-10">
                    <div class="flex items-center justify-center lg:justify-start order-last lg:order-first z-10">
                        <div class="text-center lg:text-start">
                            <span class="inline-flex py-2 px-4 text-sm text-primary rounded-full bg-primary/20 mb-8 lg:mb-2">#Special Food 🍇</span>
                            <h1 class="lg:text-6xl/normal md:text-5xl/snug text-3xl font-bold text-white text-default-950 capitalize mb-5">We Offer
                                <span class="inline-flex relative">
                                    <span className='ml-3' >Delicious</span>
                                    <img src="/circle-line.png" class="absolute -z-10 h-full w-full lg:flex hidden"/>
                                </span>
                                <span class="text-emerald-500">Food</span> And Quick Service
                            </h1>
                            <p class="text-lg text-default-700 text-black font-medium mb-8 md:max-w-md lg:mx-0 mx-auto">Imagine you don’t need a diet because we provide healthy and delicious food for you!.</p>
                            <div class="flex flex-wrap items-center justify-center  gap-5 mt-10">
       <a href='/allarenechef' >                
<button
  class="group relative inline-flex overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-50"
>
  <span
    class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600"
  ></span>

  <span
    class="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-medium backdrop-blur-3xl transition-all duration-300 group-hover:bg-slate-950/90"
  >
    <svg
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      class="mr-2 h-5 w-5 text-pink-500 transition-transform duration-300 group-hover:-translate-x-1"
    >
      <path
        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
      ></path>
    </svg>

    <span
      class="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold"
    >
      Order Now
    </span>

    <svg
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      class="ml-2 h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
      ></path>
    </svg>
  </span>
</button>
</a>  
                            </div>
                           
                        </div>
                    </div>
                </div>

                <div class="relative flex items-center justify-center py-20">
                    <span class="absolute top-0 start-0 text-3xl -rotate-[40deg]">🔥</span>
                    <span class="absolute top-0 end-[10%] -rotate-12 h-14 w-14 inline-flex items-center justify-center bg-yellow-400 text-white rounded-lg">
                        <i data-lucide="clock-3" class="h-6 w-6"></i>
                    </span>
                    <span class="absolute top-1/4 end-0 -rotate-12 h-4 w-4 inline-flex items-center justify-center bg-primary text-white rounded"></span>
                 
                    <span class="absolute bottom-0 end-0 -rotate-12 h-4 w-4 inline-flex items-center justify-center bg-primary text-white rounded-full"></span>
                    <span class="absolute -bottom-16 end-1/3 text-3xl">🔥</span>
             
               

                    <img src="/hero.png" class="mx-auto"/>
                </div>
            </div>
        </div>
    </section>
    </div>
  )
}

export default HeroSection