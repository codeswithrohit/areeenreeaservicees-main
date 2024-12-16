import React from 'react'

const Aboutus = () => {
  return (
    <div>
        <section class="lg:py-16 py-6">
        <div class="container">
            <div class="grid lg:grid-cols-2 items-start gap-10">
                <div class="flex items-center justify-center h-full w-full bg-default-500/5 rounded-lg">
                    <img src="https://img.freepik.com/free-vector/traditional-indian-cuisine-restaurant-food-ingredients-pictograms-composition-poster_1284-7742.jpg?t=st=1734313617~exp=1734317217~hmac=793b388aeb7fd2b88e09e7a04e16b4760e90e6691a28e6a73dc15191ba824b46&w=1380" class="h-full w-full"/>
                </div>
                <div class="">
                    <span class="inline-flex py-2 px-4 text-sm text-white rounded-full bg-emerald-800/80 mb-6">About Us</span>
                    <h2 class="text-3xl font-semibold text-default-900 max-w-xl mb-6">Where quality food meet Excellent services.</h2>
                    <p class="text-default-500 font-medium max-w-2xl mb-16 xl:mb-20">It’s the perfect dining experience where every dish is crafted with fresh, high-quality ingredients and served by friendly staff who go.</p>

                    <div class="grid xl:grid-cols-3 sm:grid-cols-2 gap-8">
    <div class="bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-primary-500 transform hover:scale-105">
        <div class="p-8">
            <div class="mb-6 flex justify-center">
                <img src="/cup.png" alt="Fast Food Icon" class="h-16 w-16"/>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4 text-center">Delicious Fast Foods</h3>
            <p class="text-sm text-gray-600 text-center">Indulge in a variety of quick and tasty meals, perfect for any time of the day.</p>
        </div>
    </div>

    <div class="bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-primary-500 transform hover:scale-105">
        <div class="p-8">
            <div class="mb-6 flex justify-center">
                <img src="/vegetables.png" alt="Healthy Foods Icon" class="h-16 w-16"/>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4 text-center">Nutritious Healthy Foods</h3>
            <p class="text-sm text-gray-600 text-center">Explore our selection of nutrient-dense, fresh, and wholesome meals for a healthier lifestyle.</p>
        </div>
    </div>

    <div class="bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-primary-500 transform hover:scale-105">
        <div class="p-8">
            <div class="mb-6 flex justify-center">
                <img src="/truck.png" alt="Fast Delivery Icon" class="h-16 w-16"/>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4 text-center">Reliable Fast Delivery</h3>
            <p class="text-sm text-gray-600 text-center">Get your favorite meals delivered quickly and conveniently to your doorstep.</p>
        </div>
    </div>
</div>



                 
                </div>
            </div>
        </div>
    </section>
    </div>
  )
}

export default Aboutus