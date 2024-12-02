import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaBell, FaCheckCircle,FaUser } from 'react-icons/fa';

const Test = () => {
  const [mainactiveTab, setMainActiveTab] = useState('Account'); // State to track active tab
  const [activeTab, setActiveTab] = useState("ongoingOrders");
  // Function to handle tab change
  const handleTabChange = (tab) => {
    if (userData?.verified || tab === 'Account') {
      setMainActiveTab(tab);
    } else {
      toast.warn('Your verification is under process. After verification, you can use this service.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };


  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Loading state for user authentication
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [deliverybookings, setDeliveryBookings] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true); // Loading state for fetching bookings
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thalliName, setThalliName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [availablegarments, setavailablegarments] = useState('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
  };

  useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          setUser(user);
          setIsLoadingAuth(false); // Set loading state to false when authentication state is resolved
      });
      return () => unsubscribe();
  }, []);

  useEffect(() => {
      if (user) {
          fetchUserData(user);
      }
  }, [user]);

  const fetchUserData = async (user) => {
      try {
          const userDocRef = firebase
              .firestore()
              .collection("Deliveryboy")
              .doc(user.uid);
          const userDocSnap = await userDocRef.get();
          if (userDocSnap.exists) {
              const userData = userDocSnap.data();
              if (userData && userData.isDeliveryboy) {
                  setUserData(userData);
                  if (userData && userData.verified) {
                    setMainActiveTab('orderAlert');
                  } else {
                    setMainActiveTab('Account');
                  }
                } else {
                  router.push('/Deliveryboy/loginregister');
                }
          } else {
            router.push('/Deliveryboy/loginregister');
              // Handle case where user data doesn't exist
          }
      } catch (error) {
          console.error('Error fetching user data:', error);
      } finally {
          setIsLoadingData(false); // Set loading state to false after fetching user data
      }
  };

  const handleLogout = async () => {
      const auth = getAuth();
      try {
          await signOut(auth);
          router.push('/Admin/Register');
      } catch (error) {
          console.error('Error signing out:', error);
      }
  };
  const currentUser = firebase.auth().currentUser;
  useEffect(() => {
    const fetchBookings = async () => {
        try {
            if (userData) {
                const snapshot = await firebase.firestore().collection('laundryorders').where('pincode', '==', userData.pincode).get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
                setBookings(data);
                setIsLoadingData(false); // Set loading state to false after fetching bookings
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };
    fetchBookings();
}, [userData,currentUser]);

console.log("laundrybookings",bookings)
    const fetchBookings = async () => {
        try {
            if (userData) {
                const snapshot = await firebase.firestore().collection('laundryorders').where('pincode', '==', userData.pincode).where('deliveryconfirmation', '==', "false").get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
                setDeliveryBookings(data);
                setIsLoadingData(false); // Set loading state to false after fetching bookings
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
      if (userData) {
        fetchBookings();
        const interval = setInterval(() => {
          fetchBookings();
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [userData]);

const [latitude, setLatitude] = useState(null);
const [longitude, setLongitude] = useState(null);
const [locations, setLocations] = useState(null);

useEffect(() => {
  let watchId;
  let intervalId;

  const fetchLocation = () => {
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLatitude = position.coords.latitude;
          const newLongitude = position.coords.longitude;

          // Only update if the location has changed
          if (latitude !== newLatitude || longitude !== newLongitude) {
            setLatitude(newLatitude);
            setLongitude(newLongitude);

            // Fetch location name using reverse geocoding
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLatitude},${newLongitude}&key=AIzaSyAoNz2LqEAQJjrBYsVKDs6gHQpIulUslxk`)
              .then(response => response.json())
              .then(data => {
                if (data.results && data.results.length > 0) {
                  const addressComponents = data.results[0].address_components;
                  const cityName = addressComponents.find(component => component.types.includes('locality'));
                  const stateName = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
                  const countryName = addressComponents.find(component => component.types.includes('country'));
                  const detailedLocation = [cityName, stateName, countryName]
                    .filter(component => component !== undefined)
                    .map(component => component.long_name)
                    .join(', ');
                  setLocations(detailedLocation);
                } else {
                  setLocations("Location not found");
                }
              })
              .catch(error => {
                console.error('Error fetching location:', error);
                setLocations("Error fetching location");
              });
          }
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      intervalId = setInterval(updateDeliveryboyLocation, 2000);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const updateDeliveryboyLocation = async () => {
    if (latitude && longitude && locations && userData) {
      try {
        const snapshot = await firebase.firestore().collection('laundryorders')
          .where('deliveryboyid', '==', user.uid)
          .where('deliveryconfirmation', '==', true)
          .get();
        const batch = firebase.firestore().batch();
        snapshot.forEach(doc => {
          batch.update(doc.ref, {
            deliveryboylocation: {
              latitude: latitude,
              longitude: longitude,
              address: locations, // Optionally, you can include the address
            },
          });
        });
        await batch.commit();
      } catch (error) {
        console.error('Error updating deliveryboylocation:', error);
      }
    }
  };
  

  fetchLocation();

  return () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, [latitude, longitude, locations, userData]);




  const handleConfirmOrder = async (bookingId) => {
      try {
          const currentUser = firebase.auth().currentUser;
          if (!currentUser || !currentUser.uid) {
              console.error('User is not authenticated.');
              return;
          }
  
          await firebase.firestore().collection('laundryorders').doc(bookingId).update({
              deliveryboyid: currentUser.uid,
              deliveryconfirmation:true,
              deliveryboyname:userData?.name,
              deliveryboyaddress:userData?.address,
              deliveryboyemail:userData?.email,
              deliveryboymobileNumber:userData?.mobileNumber
            //   deliveryboylocation:locations
          });
          toast.success('Order confirmed successfully!', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
          });
          window.location.reload();
      } catch (error) {
          console.error('Error confirming order:', error);
      }
  };
  

 
  

// Inside the component
const filteredBookings = !isLoadingData && bookings && bookings.filter(booking => {
  // Filter by confirmation and deliveryboyid
  if (activeTab === "today") {
      return booking.OrderDate === getCurrentDate() && booking.deliveryboyid === currentUser.uid;
  } else {
      return booking.deliveryboyid === currentUser.uid;
  }
});

const ongoingOrders = bookings 
  ? bookings.filter(booking => 
      booking.availablegarments > 0 && 
      booking.orderstatus === "Confirm" && 
      booking.deliveryboyid === currentUser.uid
    ) 
  : [];
  console.log("ongoingorders",ongoingOrders)

const currentDate = new Date().toISOString().split('T')[0];

const completedOrders = bookings 
  ? bookings.filter(booking => 
      booking.availablegarments === 0 && 
      booking.deliveryboyid === currentUser.uid
    ) 
  : [];

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString(); // This will give the date and time in a readable format
  };
  
  const handleStatusChange = async (bookingId, deliveryIndex, newStatus,garmentCount) => {
    try {
      const bookingRef = firebase.firestore().collection('laundryorders').doc(bookingId);
      const bookingDoc = await bookingRef.get();
      if (bookingDoc.exists) {
        const bookingData = bookingDoc.data();
        const orderHistory = bookingData.orderHistory;
        orderHistory[deliveryIndex].deliverystatus = newStatus;
        orderHistory[deliveryIndex].deliverydatetime = getCurrentDateTime();
        orderHistory[deliveryIndex].todayconfirm = newStatus;
  
        if (newStatus === "Out of Delivery") {
          // Update the deliveryboylocation with current location
          await bookingRef.update({
            orderHistory: orderHistory,
            deliveryboylocation: {
              latitude: latitude,
              longitude: longitude,
              address: locations, // Optionally, you can include the address
            },
          });
          toast.success('Status updated to Out of Delivery');
        } else if (newStatus === "Delivered") {
          // Update the orderHistory and decrease availablegarments by 1
          console.log("garmentcount",garmentCount)
          const updatedavailablegarments = bookingData.availablegarments - garmentCount;
          console.log("upadtedavailablegarments",updatedavailablegarments)
          await bookingRef.update({
            orderHistory: orderHistory,
            availablegarments: updatedavailablegarments,
          });
          toast.success('Status updated to Delivered');
        } else {
          await bookingRef.update({
            orderHistory: orderHistory,
          });
          toast.success('Status updated successfully');
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Reload the page after 2 seconds to give time for the toast to show
      } else {
        console.log('No such document!');
        toast.error('No such document!');
      }
    } catch (error) {
      console.error('Error updating document: ', error);
      toast.error('Error updating document');
    }
  };



  return (
    <div>
    <section className="px-6 lg:py-4 py-4 font-mono">
    {isLoadingAuth || isLoadingData ? ( // Check if either authentication or data loading is in progress
            <div className="text-center mt-4">
                Loading...
            </div>
        ) : (
<div>

        
<h1 className='text-red-600 text-center font-bold text-xl'>Arene Laundry Delivery Boy</h1>
        <div className="fixed bottom-0 left-0 w-full  flex flex-row space-x-2 md:flex-row md:justify-around py-4 md:py-2">
      <button
        className={`w-full md:w-auto flex-1 md:flex-initial px-4 py-2  flex items-center justify-center rounded-lg transform transition-transform duration-300 ${mainactiveTab === 'orderAlert' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-200 text-gray-800 hover:scale-105'}`}
        onClick={() => handleTabChange('orderAlert')}
      >
        <FaBell className="mr-2" />
        <span className="">Order Alert</span>
      </button>
      <button
        className={`w-full md:w-auto flex-1 md:flex-initial px-4 py-2 flex items-center justify-center rounded-lg transform transition-transform duration-300 ${mainactiveTab === 'confirmedOrders' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-200 text-gray-800 hover:scale-105'}`}
        onClick={() => handleTabChange('confirmedOrders')}
      >
        <FaCheckCircle className="mr-2" />
        <span className="">Confirmed Orders</span>
      </button>
      <button
        className={`w-full md:w-auto flex-1 md:flex-initial px-4 py-2 flex items-center justify-center rounded-lg transform transition-transform duration-300 ${mainactiveTab === 'Account' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-200 text-gray-800 hover:scale-105'}`}
        onClick={() => handleTabChange('Account')}
      >
        <FaUser className="mr-2" />
        <span className="">Account</span>
      </button>
    </div>
         {/* Data display based on active tab */}
    <div className="bg-gray-100 p-4 rounded-md">
      {mainactiveTab === 'orderAlert' && (
        <div>
      
       
        {/* Step 5: Use filteredBookings */}

        {!isLoadingData && deliverybookings && deliverybookings.length > 0 ? (
            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 font-[sans-serif]">
                        <thead className="bg-gray-100 whitespace-nowrap">
                        <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               Services
                              </th>
                              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Food Name
                              </th> */}
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order Details
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Booking Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                            {/* Table rows */}

            
                            {deliverybookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.firstName} {booking.lastName}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.Service}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                  <div>
                                    <p>No. of Garments: {booking.availablegarments}</p>
                                    <p>Delivery In: {booking.selectedTenure}</p>
                                    <p>Price: {booking.Payment}</p>
                                  </div>
                                </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.Payment}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                 
                                 <p>{booking.OrderDate}</p>
                              
                             </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                        {/* Display action buttons */}
                                        <Link href={`/laundrybookingdetails?orderId=${booking.orderId}`}>
                                                <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                    View Details
                                                </a>
                                            </Link>
                                        {booking.deliveryconfirmation === "false" ? (
                                       <button onClick={() => handleConfirmOrder(booking.id)}
                                       class="animate-bounce focus:animate-none ml-8 hover:animate-none inline-flex text-md font-medium bg-indigo-900  px-4 py-2 rounded-lg tracking-wide text-white">
                                       <span class="ml-2">Confirm </span>
                                   </button>
                                        ) : (
                                            <form className="flex items-center w-50 mt-2 ">
                                            {/* <select 
                                              className="bg-blue-500 text-white px-2 py-1 rounded"
                                              value={booking.orderstatus}
                                              onChange={(e) => handleOrderStatusChange(booking.id, e.target.value)}
                                            >
                                              <option value="">Select Options</option>
                                              <option value="Out of delivery">Out of delivery</option>
                                              <option value="Delivered">Delivered</option>
                                            </select> */}
                                        
                                          </form>
                                        )}
                                    </td>
                                   
                                  
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            <div className="text-center mt-4">
                {activeTab === "today" ? "No orders for today" : "No orders"}
            </div>
        )}
        </div>
      )}

{mainactiveTab === 'confirmedOrders' && (
                <div>
                  <div className="sm:flex items-center mt-2 mb-4 ">
                    <div className="flex ">
                      <button
                        className={`mx-1 px-3 py-1 rounded ${activeTab === "ongoingOrders" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                        onClick={() => setActiveTab("ongoingOrders")}
                      >
                        Ongoing Orders
                      </button>
                      <button
                        className={`mx-1 px-3 py-1 rounded ${activeTab === "completedOrders" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                        onClick={() => setActiveTab("completedOrders")}
                      >
                        Completed Orders
                      </button>
                    </div>
                  </div>
                  {activeTab === "ongoingOrders" && (
                     <div>
                     {!isLoadingData && ongoingOrders && ongoingOrders.length > 0 ? (
                       <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                         <div className="w-full overflow-x-auto">
                           <table className="min-w-full divide-y divide-gray-200 font-[sans-serif]">
                             <thead className="bg-gray-100">
                               <tr>
                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                               </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
      {ongoingOrders.map((booking, index) => (
        <React.Fragment key={booking.id}>
          <tr>
            <td className="px-6 py-4 text-sm text-gray-800">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center font-bold rounded-full bg-gray-200 text-gray-800 mr-3">
                  {index + 1}.
                </div>
                {booking.firstName} {booking.lastName}
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-[#333]">{booking.Service}</td>
            <td className="px-6 py-4 text-sm text-[#333]">
                                  <div>
                                    <p>No. of Garments: {booking.availablegarments}</p>
                                    <p>Delivery In: {booking.selectedTenure}</p>
                                    <p>Price: {booking.Payment}</p>
                                  </div>
                                </td>
            <td className="px-6 py-4 text-sm text-gray-800">{booking.Payment}</td>
            <td className="px-6 py-4 text-sm text-[#333]">
                                 
                                 <p>{booking.OrderDate}</p>
                              
                             </td>
            <td className="px-6 py-4 text-sm text-gray-800">
             
               
            <Link href={`/Admin/adminarenelaundrydetails?orderId=${booking.orderId}`}>
                  <a className="bg-blue-500 text-white px-2 py-1 rounded">Booking Details</a>
                </Link>
            </td>
          </tr>
          {booking.orderHistory && booking.orderHistory.length > 0 && (
            <tr>
              <td colSpan="7">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pickup Date</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Garment Count</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {booking.orderHistory.map((delivery, deliveryIndex) => (
                        delivery.pickupDate === currentDate && (
                          <tr key={deliveryIndex} className={delivery.deliverystatus === "cancel" ? "border-b-2 border-red-500" : ""}>
                                                       <td className="px-3 py-1 text-sm font-medium text-gray-900">{delivery.pickupDate}</td>
                                                       <td className="px-3 py-1 text-sm text-gray-500">{delivery.garmentCount}</td>

                            <td className="px-3 py-1 text-sm text-gray-500">
                              <select
                                value={delivery.deliverystatus}
                                onChange={(e) => handleStatusChange(booking.id, deliveryIndex, e.target.value, delivery.garmentCount)}
                                className="border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="">Change Status</option>
                                <option value="Out of Delivery">Out of Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              {delivery.deliverystatus}
                              {delivery.deliverystatus === "Out of Delivery" && (
                  <div>
                    <a href={`/Deliveryboy/viewmaplaundry?orderId=${booking.orderId}`} className="text-green-500 cursor-pointer font-bold p-2 rounded">
                    Track Order
                    </a>
                  </div>
                )}
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
                           </table>
                         </div>
                       </div>
                     ) : (
                       <div className="text-center mt-4">No ongoing orders</div>
                     )}
                   </div>
                  )}

                  {activeTab === "completedOrders" && (
                    <div>
                      {!isLoadingData && completedOrders && completedOrders.length > 0 ? (
                        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                          <div className="w-full overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 font-[sans-serif]">
                              <thead className="bg-gray-100 whitespace-nowrap">
                              <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer Name
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Services
                                  </th>
                                 
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Details
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking Date
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                                {completedOrders.map(booking => (
                                  <tr key={booking.id}>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.firstName} {booking.lastName}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.Service}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                  <div>
                                    <p>No. of Garments: {booking.availablegarments}</p>
                                    <p>Delivery In: {booking.selectedTenure}</p>
                                    <p>Price: {booking.Payment}</p>
                                  </div>
                                </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.Payment}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                 
                                 <p>{booking.OrderDate}</p>
                              
                             </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                      {booking.orderstatus === "Out of delivery" && (
                                        <div>
                                          <a href={`/mapview?orderId=${booking.orderId}`} className="bg-green-500 text-white px-2 py-1 rounded">
                                            View on Map
                                          </a>
                                        </div>
                                      )}
                                   <Link href={`/laundrybookingdetails?orderId=${booking.orderId}`}>
                                          <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                            View Details
                                          </a>
                                        </Link>
                                      {/* <button onClick={() => handleConfirmOrder(booking.id)}
                                        className="animate-bounce focus:animate-none ml-8 hover:animate-none inline-flex text-md font-medium bg-indigo-900  px-4 py-2 rounded-lg tracking-wide text-white">
                                        <span className="ml-2">Confirm </span>
                                      </button> */}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center mt-4">
                          No completed orders
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

{mainactiveTab === 'Account' && (
                <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center">Account Details</h2>
                <div className="flex justify-center items-center space-x-4">
                {userData.aadharCardUrl && (
                      <img
                        src={userData.aadharCardUrl}
                        alt="Aadhar Card"
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                      />
                    )}
                    {userData.panCardUrl && (
                      <img
                        src={userData.panCardUrl}
                        alt="Pan Card"
                        className="w-32 h-32 object-cover rounded-lg shadow-md mt-2"
                      />
                    )}
                </div>
                <div className="text-center">
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Address:</strong> {userData.address}</p>
                  <p><strong>Delivery for:</strong> {userData.boyType}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Mobile Number:</strong> {userData.mobileNumber}</p>
                  <p><strong>Pincode:</strong> {userData.pincode}</p>
                  <p><strong>verification:</strong> {userData.verified ? 'You are verified ' : 'In Process'}</p>
                </div>
                <div className="text-center mt-4">
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
              )}
    </div>

    
        </div>
        )}
    </section>
    
 



    <ToastContainer />
</div>
  );


};

export default Test;
