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
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Loading state for user authentication
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true); // Loading state for fetching bookings
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thalliName, setThalliName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [availablegarments, setavailablegarments] = useState('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const router = useRouter();
  const currentUser = firebase.auth().currentUser;
 
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
        .collection("ArenelaundryVendor")
        .doc(user.uid);
      const userDocSnap = await userDocRef.get();
      if (userDocSnap.exists) {
        const userData = userDocSnap.data();
        if (userData && userData.isArenelaundry) {
          setUserData(userData);
          if (userData && userData.verified) {
            setMainActiveTab('orderAlert');
          } else {
            setMainActiveTab('Account');
          }
        } else {
          router.push('/ArenelaundryVendor/loginregister');
        }
      } else {
        router.push('/ArenelaundryVendor/loginregister');
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
      router.push('/ArenelaundryVendor/loginregister');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

 
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
    useEffect(() => {
      if (userData) {
        fetchBookings();
        const interval = setInterval(() => {
          fetchBookings();
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [userData]);
  const handleConfirmOrder = async (bookingId) => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser || !currentUser.uid) {
        console.error('User is not authenticated.');
        return;
      }

      await firebase.firestore().collection('laundryorders').doc(bookingId).update({
        confirmation: true,
        vendorid: currentUser.uid,
        VendorLocation: userData?.address,
        VendormobileNumber: userData?.mobileNumber,
        Vendorname: userData?.name,
        Vendoremail: userData?.email,
        deliveryconfirmation: 'false',
        orderstatus: "Confirm",
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
  console.log("current date",getCurrentDate)
  const filteredBooking = !isLoadingData && bookings && (activeTab === "today"
  ? bookings.filter(booking => {
      // Filter by confirmation and vendorid
      return booking.OrderDate === getCurrentDate() && booking.confirmation === 'false' ;
  })
  : bookings.filter(booking => {
      // Filter by confirmation and vendorid
      return booking.confirmation === 'false' ;
  }));

  const ongoingOrders = bookings ? bookings.filter(booking => booking.availablegarments > 0 && booking.orderstatus === "Confirm") : [];
  const currentDate = new Date().toISOString().split('T')[0];
  const completedOrders = bookings ? bookings.filter(booking => booking.availablegarments === 0) : [];

  const handleStatusChange = async (bookingId, deliveryIndex, newStatus) => {
    try {
      const bookingRef = firebase.firestore().collection('laundryorders').doc(bookingId);
      const bookingDoc = await bookingRef.get();
      console.log(bookingId)
      if (bookingDoc.exists) {
        const orderHistory = bookingDoc.data().orderHistory;
        orderHistory[deliveryIndex].deliverystatus = newStatus;
        orderHistory[deliveryIndex].todayconfirm = newStatus;
  
        await bookingRef.update({ orderHistory: orderHistory });
        toast.success('Status updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
                <div className="flex justify-center items-center h-screen">
                <button type="button"
                        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
                    Loading
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin"
                         viewBox="0 0 24 24">
                        <path fillRule="evenodd"
                              d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
                              clipRule="evenodd" data-original="#000000"/>
                    </svg> {/* You can replace this with any loading spinner component or element */}
                </button>
            </div>
        ) : (
          <div>
           <h1 className='text-red-600 text-center font-bold text-xl'>Arene Laundry  </h1>
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
                  {!isLoadingData && filteredBooking && filteredBooking.length > 0 ? (
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
                                Starting From
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                            {filteredBooking.map(booking => (
                              <tr key={booking.id}>
                                <td className="px-6 py-4 text-sm text-[#333]">{booking.firstName} {booking.lastName}</td>
                                <td className="px-6 py-4 text-sm text-[#333]">{booking.Service}</td>
                                {/* <td className="px-6 py-4 text-sm text-[#333]">{booking.Foodname}</td> */}
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
                                  
                                <Link href={`/laundrybookingdetails?orderId=${booking.orderId}`}>
                                      <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                        View Details
                                      </a>
                                    </Link>
                               {booking.orderstatus === "Processing" && (
          <button onClick={() => handleConfirmOrder(booking.id)}
            className="animate-bounce focus:animate-none ml-8 hover:animate-none inline-flex text-md font-medium bg-indigo-900  px-4 py-2 rounded-lg tracking-wide text-white">
            <span className="ml-2">Confirm </span>
          </button>
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
                      {activeTab === "ongoingOrders" ? "No orders" : "No orders"}
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
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting From</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                               </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                               {ongoingOrders.map((booking) => {
                                 const garmentTypes = JSON.parse(booking.GarmentTypes);
                                 return (
                                   <React.Fragment key={booking.id}>
                                     <tr>
                                       <td className="px-6 py-4 text-sm text-[#333]">{booking.firstName} {booking.lastName}</td>
                                       <td className="px-6 py-4 text-sm text-[#333]">{booking.Service}</td>
                                       <td className="px-6 py-4 text-sm text-[#333]">
                                         <div>
                                           <p>No. of Garments: {garmentTypes.noofgarments}</p>
                                           <p>Delivery In: {booking.selectedTenure}</p>
                                           <p>Price: {garmentTypes.price}</p>
                                         </div>
                                       </td>
                                       <td className="px-6 py-4 text-sm text-[#333]">{booking.Payment}</td>
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
                                                           onChange={(e) => handleStatusChange(booking.id, deliveryIndex, e.target.value)}
                                                           className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                         >
                                                           <option value="pending">Pending</option>
                                                           <option value="todaydelivered">Today Delivered</option>
                                                           <option value="deliver">Deliver</option>
                                                           <option value="cancel">Cancel</option>
                                                         </select>
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
                                 );
                               })}
                             </tbody>
                           </table>
                         </div>
                       </div>
                     ) : (
                       <p className="text-center text-gray-500 py-5">No ongoing orders found.</p>
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
                                    Starting From
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
                                {/* <td className="px-6 py-4 text-sm text-[#333]">{booking.Foodname}</td> */}
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
                  <p><strong>User as:</strong> Arene Laundry Vendor</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Mobile Number:</strong> {userData.mobileNumber}</p>
                  <p><strong>Pincode:</strong> {userData.pincode}</p>
                  <p><strong>Verification:</strong> {userData.verified ? 'You are verified ' : 'In Process'}</p>
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
