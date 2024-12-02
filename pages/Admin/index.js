import React, { useEffect, useState,Fragment } from 'react';
import { firebase } from '../../Firebase/config';
import Link from 'next/link';
import AdminNavbar from '../../components/AdminNavbar';
import { FaUsers, FaHome, FaTshirt, FaUtensils } from 'react-icons/fa';

const Index = () => {
  const [bookings, setBookings] = useState(null);
  const [todaybookings, setTodayBookings] = useState(null);
  const [cheforder, setCheforder] = useState(null);
  const [todaycheforder, setTodayCheforder] = useState(null);
  const [laundryorder, setLaundryorder] = useState(null);
  const [todaylaundryorder, setTodayLaundryorder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [registration, setRegistration] = useState([]);

  useEffect(() => {
      const fetchBookings = async () => {
          try {
              const snapshot = await firebase.firestore().collection('bookings').get();
              const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              // Filter bookings by current date
              const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
              const filteredBookings = data.filter(booking => booking.OrderDate === currentDate);
              // Log the booking data
              console.log('Today\'s bookings:', filteredBookings);
              setTodayBookings(filteredBookings)
              // Sort bookings by OrderDate from current date to the latest date
              data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
              setBookings(data);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching bookings:', error);
              setLoading(false);
          }
      };

      fetchBookings();
  }, []);


  useEffect(() => {
      const fetchBookings = async () => {
          try {
              const snapshot = await firebase.firestore().collection('kitchenorder').get();
              const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              // Filter bookings by current date
              const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
              const filteredBookings = data.filter(booking => booking.OrderDate === currentDate);
              // Log the booking data
              console.log('Today\'s bookings:', filteredBookings);
              setTodayCheforder(filteredBookings)
              // Sort bookings by OrderDate from current date to the latest date
              data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
              setCheforder(data);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching bookings:', error);
              setLoading(false);
          }
      };

      fetchBookings();
  }, []);
  useEffect(() => {
      const fetchBookings = async () => {
          try {
              const snapshot = await firebase.firestore().collection('laundryorders').get();
              const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              // Filter bookings by current date
              const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
              const filteredBookings = data.filter(booking => booking.OrderDate === currentDate);
              // Log the booking data
              console.log('Today\'s bookings:', filteredBookings);
              setTodayLaundryorder(filteredBookings)
              // Sort bookings by OrderDate from current date to the latest date
              data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
              setLaundryorder(data);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching bookings:', error);
              setLoading(false);
          }
      };

      fetchBookings();
  }, []);

  useEffect(() => {
    const db = firebase.firestore();
    const RegistrationRef = db.collection("Users");

    RegistrationRef.get()
      .then((RegistrationSnapshot) => {
        const RegistrationData = [];
        RegistrationSnapshot.forEach((doc) => {
          RegistrationData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        RegistrationData.sort(
          (a, b) => new Date(b.currentDate) - new Date(a.currentDate)
        );

        setRegistration(RegistrationData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        setIsLoading(false);
      });
  }, []);

  const Totalorder = bookings ? bookings.length : 0;
  const Totalcheforder = cheforder ? cheforder.length : 0;
  const Totallaundryorder = laundryorder ? laundryorder.length : 0;
  const Totaluser = registration ? registration.length : 0;
  return (
    <div className="min-h-[100vh] bg-white w-full nourd-text admin-dashboard">
      <AdminNavbar />
      <div className="lg:ml-64">
      {loading ? (
          <div className="flex justify-center items-center h-screen">
       <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-12 h-12 animate-spin"
       viewBox="0 0 16 16">
       <path
           d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
       <path fill-rule="evenodd"
           d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
   </svg>
   </div>
      ) : (
        <div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
          <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
            <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <FaUsers className="text-blue-800 dark:text-gray-800 text-3xl transition-transform duration-500 ease-in-out" />
            </div>
            <div className="text-right">
              <p className="text-2xl">{Totaluser}</p>
              <p>Total Users</p>
            </div>
          </div>
          <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
            <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <FaHome className="text-blue-800 dark:text-gray-800 text-3xl transition-transform duration-500 ease-in-out" />
            </div>
            <div className="text-right">
              <p className="text-2xl">{Totalorder}</p>
              <p>Total Property Booking</p>
            </div>
          </div>
          <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
            <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <FaTshirt className="text-blue-800 dark:text-gray-800 text-3xl transition-transform duration-500 ease-in-out" />
            </div>
            <div className="text-right">
              <p className="text-2xl">{Totallaundryorder}</p>
              <p>Total Laundry Order</p>
            </div>
          </div>
          <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
            <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
              <FaUtensils className="text-blue-800 dark:text-gray-800 text-3xl transition-transform duration-500 ease-in-out" />
            </div>
            <div className="text-right">
              <p className="text-2xl">{Totalcheforder}</p>
              <p>Total Chef Order</p>
            </div>
          </div>
        </div>

        <div class="mt-4 mx-4">
          <h1 className='text-lg text-center font-bold font-mono' >Today Property Booking</h1>
          <div class="w-full overflow-hidden rounded-lg shadow-xs">
            <div class="w-full overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th class="px-4 py-3"> Customer Name</th>
                    <th class="px-4 py-3"> Order Details</th>
                    <th class="px-4 py-3">Payment</th>
                    <th class="px-4 py-3">Booking Date</th>
                    <th class="px-4 py-3"> Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {todaybookings.length === 0 && (
  <tr>
    <td colSpan="6" className="px-6 py-4 text-center text-[#333]">
      Today, there are no orders.
    </td>
  </tr>
)}
  {todaybookings &&
                           todaybookings.map((booking) => (
                  <tr key={booking.id} class="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                    <td class="px-4 py-3">
                      <div class="flex items-center text-sm">
                        
                        <div>
                          <p class="font-semibold"> {booking.Name}</p>
                          {/* <p class="text-xs text-gray-600 dark:text-gray-400">10x Developer</p> */}
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm">   `${booking.Propertyname}-${booking.roomType}-${booking.roomprice}`</td>
                    <td class="px-4 py-3 text-xs">
                    {booking.bookingDate instanceof Object ? (
                                   // If bookingDate is an object, extract checkIn or checkOut
                                   <>
                                     <p>Check In: {booking.bookingDate.checkIn}</p>
                                     {booking.bookingDate.checkOut ? (
                                       <p>Check Out: {booking.bookingDate.checkOut}</p>
                                     ) : null}
                                   </>
                                 ) : (
                                   // If bookingDate is a string, display it directly
                                   <p>{booking.bookingDate}</p>
                                 )}
                    </td>
                    <td class="px-4 py-3 text-sm"><Link href={`/Admin/adminorder?orderId=${booking.orderId}`}>
                                     <a className="bg-blue-500 text-white px-2 py-1 rounded">Booking Details</a>
                                   </Link></td>
                  </tr>
                           ))}

                </tbody>
              </table>
            </div>
      </div>
    </div>


    <div class="mt-4 mx-4">
          <h1 className='text-lg text-center font-bold font-mono' >Today Laundry Booking</h1>
          <div class="w-full overflow-hidden rounded-lg shadow-xs">
            <div class="w-full overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th class="px-4 py-3"> Customer Name</th>
                    <th class="px-4 py-3"> Service</th>
                    <th class="px-4 py-3"> Order Details</th>
                    <th class="px-4 py-3">  Payment</th>
                    {/* <th class="px-4 py-3">Booking Date</th> */}
                    <th class="px-4 py-3"> Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {todaylaundryorder && todaylaundryorder.length === 0 && (
  <tr>
    <td colSpan="6" className="px-6 py-4 text-center text-[#333]">
      Today, there are no orders.
    </td>
  </tr>
)}
  {todaylaundryorder &&
                           todaylaundryorder.map((booking) => (
                  <tr key={booking.id} class="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                    <td class="px-4 py-3">
                      <div class="flex items-center text-sm">
                        
                        <div>
                          <p class="font-semibold"> {booking.firstName} {booking.lastName}</p>
                          {/* <p class="text-xs text-gray-600 dark:text-gray-400">10x Developer</p> */}
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm">   {booking.Service}</td>
                    <td class="px-4 py-3 text-xs">
                    <div>
                    <p>No. of Garments: {booking.Noofgarment}</p>
                    <p>Tenure: {booking.selectedTenure}</p>
                    <p>Price: {booking.totalpayment}</p>
                </div>
                    </td>
                    <td class="px-4 py-3 text-xs">
                    {booking.Payment}
                    </td>
                    <td class="px-4 py-3 text-sm"> <Link href={`/Admin/adminarenelaundrydetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                Booking Details
                                                                            </a>
                                                                        </Link></td>
                  </tr>
                           ))}

                </tbody>
              </table>
            </div>
      </div>
    </div>


    <div class="mt-4 mx-4">
          <h1 className='text-lg text-center font-bold font-mono' >Today Chef Booking</h1>
          <div class="w-full overflow-hidden rounded-lg shadow-xs">
            <div class="w-full overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th class="px-4 py-3"> Customer Name</th>
                    <th class="px-4 py-3">  Thalli Name</th>
                    <th class="px-4 py-3"> Order Details</th>
                    <th class="px-4 py-3">  Payment</th>
                    {/* <th class="px-4 py-3">Booking Date</th> */}
                    <th class="px-4 py-3"> Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {todaycheforder && todaycheforder.length === 0 && (
  <tr>
    <td colSpan="6" className="px-6 py-4 text-center text-[#333]">
      Today, there are no orders.
    </td>
  </tr>
)}
  {todaycheforder && todaycheforder.map(booking => (
                  <tr key={booking.id} class="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                    <td class="px-4 py-3">
                      <div class="flex items-center text-sm">
                        
                        <div>
                          <p class="font-semibold"> {booking.firstName} {booking.lastName}</p>
                          {/* <p class="text-xs text-gray-600 dark:text-gray-400">10x Developer</p> */}
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm">  {booking.thaliname}</td>
                    <td class="px-4 py-3 text-xs">
                    <div>
                    <p>No. of Thalli: {booking.noofthalli}</p>
                    <p>Tenure: {booking.selectedTenure}</p>
                    <p>Price: {booking.Foodcharge}</p>
                </div>
                    </td>
                    <td class="px-4 py-3 text-xs">
                    {booking.Payment}
                    </td>
                    <td class="px-4 py-3 text-sm"><Link href={`/Admin/adminarenechefdetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                Booking Details
                                                                            </a>
                                                                        </Link></td>
                  </tr>
                           ))}

                </tbody>
              </table>
            </div>
      </div>
    </div>




    </div>
      )}
    </div>
    </div>
  );
};

export default Index;
