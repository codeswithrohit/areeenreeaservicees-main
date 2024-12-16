import React from 'react'

const DownloadApp = () => {
  return (
    <div>
          
  <section class="lg:py-16 py-6">
        <div class="container">
            <div class="bg-emerald-800/20 rounded-lg">
                <div class="grid lg:grid-cols-2 items-center gap-6">
                    <div class="relative lg:p-20 p-6 h-full">
                        <span class="absolute end-16 top-1/3 text-xl rotate-45">😃</span>
                        <span class="absolute end-0 top-1/2 text-xl rotate-45">🔥</span>
                        <span class="absolute bottom-40 end-40 h-2 w-2 inline-flex items-center justify-center bg-emerald-800 text-white rounded-full"></span>
                        
                        <span class="inline-flex py-2 px-4 text-sm text-emerald-800 rounded-full bg-emerald-800/20 mb-6">Download App</span>
                        <h2 class="text-3xl/relaxed font-semibold text-default-900 max-w-sm mb-6">Get Started With Us Today!</h2>
                        <p class="text-default-900 text-base max-w-md mb-10">Discover food wherever and whenever and get your food delivered quickly.</p>
                        <a href="javascript:void(0)" class="inline-flex py-3 px-10 font-medium text-white bg-emerald-800 rounded-full hover:bg-emerald-800-500 transition-all">Download Now</a>
                    </div>
                    <div class="relative pt-20 px-20">
                        <span class="absolute end-10 bottom-28 text-3xl -rotate-45">🔥</span>
                        <span class="absolute bottom-10 end-20 h-3 w-3 inline-flex items-center justify-center bg-emerald-800 text-white rounded-full"></span>
                        <span class="absolute top-1/4 end-10 h-2.5 w-2.5 inline-flex items-center justify-center bg-yellow-400 text-white rounded-full"></span>
                        <span class="absolute end-1/4 top-12 text-xl -rotate-45">😋</span>
                        <span class="absolute start-10 top-12 h-2 w-2 inline-flex items-center justify-center bg-emerald-800 text-white rounded-full"></span>
                        <img src="/mockup.png" class="max-w-full max-h-full"/>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </div>
  )
}

export default DownloadApp