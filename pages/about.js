import React from 'react';

const AboutAreneServices = () => {
  return (
    <div className="bg-white py-16">
      <div className="w-full mx-auto px-6 sm:px-12 lg:px-20">
        <div className="bg-white  rounded-lg p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">About Arene Services</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8 text-center">
            Welcome to <span className="text-emerald-600 font-semibold">Arene Services</span>,where convenience meets versatility! We are your one-stop solution for a wide array of essential services designed to simplify your life. At Arene, we believe in delivering exceptional experiences across multiple domains, ensuring that whatever your need, we have you covered—all at nominal or negligible charges for the extraordinary services we provide.

          </p>

          <img className='h-full w-full' src='/about.png' />
          
          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Our Services</h2>
          <div className="space-y-6">
            {/* Service 1 */}
            <div className="flex flex-col md:flex-row items-start md:items-center bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Arene PG Accommodation</h3>
                <p className="text-gray-600 mt-2">
                Whether you’re a student, professional, or traveler, our well-maintained and comfortable paying guest accommodations are designed to make you feel at home, away from home.  </p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="flex flex-col md:flex-row items-start md:items-center bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Property Buying & Selling</h3>
                <p className="text-gray-600 mt-2">
                Navigating the real estate market can be daunting, but not with Arene Services by your side. From finding your dream property to selling at the best price, we provide expert assistance to help you make the right decisions, offering end-to-end support for a seamless experience. </p>
              </div>
            </div>

            {/* Service 3 */}
            <div className="flex flex-col md:flex-row items-start md:items-center bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">3</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Arene Chef Food Services</h3>
                <p className="text-gray-600 mt-2">
                Highlighting Our Famous Student Special Thali: When it comes to food, Arene Services takes pride in delivering not only variety but also excellence. Our most cherished offering is the Student Special Thali, a perfect blend of taste, nutrition, and affordability. Specifically designed for students, this thali is packed with delicious, wholesome meals that cater to the needs of growing minds and bodies—all at a price that students can easily afford. It’s not just a meal; it’s a nourishing experience that keeps you energized throughout the day.
<br/>
<br/>
But that’s not all! We also offer a wide range of other food options, from quick snacks to full-course meals, ensuring that every craving is satisfied. Whether you’re in the mood for something light or a hearty meal, we have something for everyone, crafted with care and quality. Our commitment to providing fresh, delicious, and affordable food makes us the go-to choice for students, professionals, and families alike.   </p>
              </div>
            </div>

            {/* Service 4 */}
            <div className="flex flex-col md:flex-row items-start md:items-center bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">4</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Laundry Services</h3>
                <p className="text-gray-600 mt-2">
                Wash, Iron, and Fold with Fast Delivery: Say goodbye to laundry day woes! With our efficient laundry services, including wash, iron, and fold, you can have your clothes cleaned and delivered back to you as fast as 2 hours. We ensure your laundry is handled with care and returned neatly pressed, ready for use. Our lightning-fast turnaround and affordable rates make this service perfect for busy individuals who need quick, reliable help.  </p>
              </div>
            </div>

            {/* Service 5 */}
            <div className="flex flex-col md:flex-row items-start md:items-center bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">5</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Hotel & Resort Bookings</h3>
                <p className="text-gray-600 mt-2">
                Planning a getaway or a business trip? Arene Services makes hotel and resort booking a breeze, offering a selection of accommodations to fit your style and budget. </p>
              </div>
            </div>

            {/* Service 6 */}
            <div className="flex flex-col md:flex-row items-start md:items-center bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">6</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Banquet Hall/Farm House Bookings</h3>
                <p className="text-gray-600 mt-2">
                Hosting an event? Our banquet hall and farm house booking services provide stunning venues for weddings, parties, corporate events, and more, ensuring your event is unforgettable.   </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Why Choose Arene Services?</h2>
            <p className="text-gray-600 leading-relaxed">
            At Arene Services, we’re more than just a service provider—we’re your trusted partner for every aspect of your lifestyle. Our dedication to quality, affordability, and customer satisfaction is at the heart of everything we do. We offer expert assistance to help you make the right decisions, and we combine innovation, convenience, and professionalism to offer the best service in every domain—all for a price that’s easy on your wallet. </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAreneServices;
