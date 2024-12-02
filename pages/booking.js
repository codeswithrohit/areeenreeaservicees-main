import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import { firebase } from '../Firebase/config';
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const Booking = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [mobilenumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentOption, setPaymentOption] = useState("allday");
  const [includeDonation, setIncludeDonation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { Name, roomType, roomprice, Agentid, location, checkInDate } = router.query;
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [savings, setSavings] = useState(0); // Added state for savings
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      setLoading(true);
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
        router.push('/signin'); // Redirect to sign-in page
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const fetchedUserData = userDoc.data();
        setUserData(fetchedUserData);
        setName(fetchedUserData.name || "");
        setEmail(fetchedUserData.email || "");
        setMobileNumber(fetchedUserData.mobileNumber || "");
        setAddress(fetchedUserData.address || "");
      } else {
        router.push('/signin'); // Redirect to sign-in page if user data not found
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push('/signin'); // Redirect to sign-in page on error
    } finally {
      setLoading(false);
    }
  };
  const loadScript = async (src) => {
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
      return true;
    } catch (error) {
      console.error('Error loading script:', error);
      toast.error('Failed to load Razorpay SDK. Please try again later.');
      return false;
    }
  };
  const generateOrderId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 999999
    const now = new Date(); // Get the current date and time
  
    // Format the date and time components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    // Create the formatted date and time string
    const formattedDateTime = `${year}${month}${day}-${hours}${minutes}${seconds}`;
  
    // Append the random number to the formatted date and time
    const orderId = `ARENE-${formattedDateTime}-${randomNumber}`;
  
    return orderId;
  };
  useEffect(() => {
    // Fetch coupon data from Firestore
    const db = firebase.firestore();
    const couponRef = db.collection("Coupan");

    couponRef
      .get()
      .then((querySnapshot) => {
        const coupons = [];
        querySnapshot.forEach((doc) => {
          coupons.push({ ...doc.data(), id: doc.id });
        });

        setCouponData(coupons);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        setLoading(false);
      });
  }, []);

 const applyCoupon = (couponCode) => {
  console.log('Applying coupon:', couponCode); // Log coupon code
  
  // Check if couponData is loaded
  if (!couponData || couponData.length === 0) {
    console.log('Coupons are not loaded yet.');
    toast.error('Coupons are not loaded yet. Please wait.');
    return getPaymentAmount(); // Return current payment amount
  }

  // Find the coupon from couponData
  const coupon = couponData.find((coupon) => coupon.code === couponCode);
  console.log('Found coupon:', coupon);

  if (coupon) {
    const currentDate = dayjs().format('YYYY-MM-DD');
    const expiryDate = dayjs(coupon.expirydate).format('YYYY-MM-DD');
    console.log('Current date:', currentDate);
    console.log('Coupon expiry date:', expiryDate);

    if (dayjs(currentDate).isBefore(expiryDate) || dayjs(currentDate).isSame(expiryDate, 'day')) {
      // Calculate discounted price
      const discountAmount = parseFloat(coupon.price); // Assuming coupon.price is the fixed discount amount
      let basePrice = 0;

  
      if (paymentOption === 'oneday') {
        basePrice = 500;
      } else if (paymentOption === 'threeday') {
        basePrice = 1000;
      } else {
        basePrice = getPaymentAmount().paymentAmount; // fallback to current payment amount
      }

      const discountedPrice = basePrice - discountAmount;

      console.log('Base price:', basePrice);
      console.log('Discount amount:', discountAmount);
      console.log('Discounted price:', discountedPrice);

      setAppliedCoupon(coupon);
      setSavings(discountAmount);
      toast.success(`Coupon ${coupon.code} applied successfully!`);
      return discountedPrice;
    } else {
      console.log('Coupon has expired.');
      toast.error(`Coupon ${coupon.code} has expired!`);
    }
  } else {
    console.log('Invalid coupon code.');
    toast.error('Invalid coupon code!');
  }
  return getPaymentAmount().paymentAmount;
};


  const submitBookingData = async (paymentAmount,total,payAtCheckIn) => {
    try {
      setLoading(true);
      const currentDate = new Date().toISOString().slice(0, 10);
      let oneday = paymentOption === 'oneday';
      let threeday = paymentOption === 'threeday';
      let allday = paymentOption === 'allday';
      const orderId = generateOrderId();
      await firebase.firestore().collection('bookings').add({
        Name: name,
        orderId: orderId,
        address: address,
        phoneNumber: mobilenumber,
        email: email,
        Propertyname: Name,
        Location: location,
        roomType: roomType,
        roomprice: roomprice,
        Agentid: Agentid,
        Userid: user.uid,
        savings:savings,
        paymentOption:paymentOption,
        OrderDate: currentDate,
        Totalpayment:total,
        payAtCheckIn:payAtCheckIn,
        Payment: paymentAmount,
        oneday: oneday,
        threeday: threeday,
        allday: allday,
        totalpayment: roomprice,
        bookingDate: {
          checkInDate: checkInDate,
        },
      });
      setLoading(false);
      router.push(`/bookingdetails?orderId=${orderId}`);
      toast.success('Booking Successful!');
    } catch (error) {
      console.error('Error submitting booking data:', error);
      toast.error('Failed to submit booking data. Please try again later.');
    }
  };

  const initiatePayment = async () => {
    if (!name || !email || !mobilenumber || !address) {
      toast.error('Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true);
      let { paymentAmount, payAtCheckIn,total } = getPaymentAmount();
      console.log("Payment Amount (in paise):", paymentAmount * 100);
      console.log("Pay At Check-In:", payAtCheckIn);
  
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Failed to load Razorpay SDK. Please try again later.');
        return;
      }
  
      const amountInPaise = paymentAmount * 100;
      if (amountInPaise < 10000) { // Ensure minimum 100 INR (10000 paise)
        toast.error('Invalid amount: Minimum value should be 100 INR.');
        return;
      }
  
      const options = {
        key: 'rzp_test_td8CxckGpxFssp',
        currency: 'INR',
        amount: amountInPaise,
        name: 'Arene Services',
        description: 'Thanks for purchasing',
        image: 'https://www.areneservices.in/public/front/images/property-logo.png',
        handler: async function (response) {
          console.log('Payment Successful:', response);
          await submitBookingData(paymentAmount,total,payAtCheckIn);
          await axios.post('/api/sendEmail', {
            Name,
            roomType,
            roomprice,
            location,
            email,
            name,
            checkInDate
          });
          await axios.post('/api/sendMessage', {
            Name,
            roomType,
            roomprice,
            location,
            email,
            name,
            phoneNumber,
            checkInDate
          });
        },
        prefill: {
          name: name,
          email: email,
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  const getPaymentAmount = () => {
    let paymentAmount;
    let payAtCheckIn;
    const baseAmount = roomprice ;
    if (paymentOption === 'oneday') {
      paymentAmount = 700;
      payAtCheckIn = baseAmount-paymentAmount+350; // 4250 - 500
    } else if (paymentOption === 'threeday') {
      paymentAmount = 1350;
      payAtCheckIn = baseAmount-paymentAmount+350; // 4250 - 1000
    } else {
      paymentAmount = (roomprice ? Math.round(parseFloat(roomprice) + 350 - savings ) : 4350);
      payAtCheckIn = 0; // Full payment upfront
    }
  
    if (includeDonation) {
      paymentAmount += 1;
    }
  
    if (appliedCoupon && typeof appliedCoupon.discountAmount === 'number') {
      const discountedPrice = paymentAmount - appliedCoupon.discountAmount;
      paymentAmount = Math.max(discountedPrice, 100); // Ensure minimum payment amount of 100
    }
  
    // Ensure the final paymentAmount is an integer and meets the minimum value requirement
    paymentAmount = Math.max(Math.round(paymentAmount), 100);
    const total = paymentAmount + payAtCheckIn-savings;
    return { paymentAmount, payAtCheckIn,total };
  };
  
  
  
  
  const getDateRange = (option) => {
    const checkIn = dayjs(checkInDate); // Parse checkInDate with dayjs
    let startDate = checkIn.format('YYYY-MM-DD');
    let endDate = '';

    if (option === 'oneday') {
      const nextDay = checkIn.add(1, 'day');
      endDate = nextDay.format('YYYY-MM-DD');
      return `Check-in between ${startDate} to ${endDate}`;
    }

    if (option === 'threeday') {
      const threeDaysLater = checkIn.add(3, 'day');
      endDate = threeDaysLater.format('YYYY-MM-DD');
      return `Check-in between ${startDate} to ${endDate}`;
    }

    if (option === 'allday') {
      const oneMonthLater = checkIn.add(1, 'month');
      endDate = oneMonthLater.format('YYYY-MM-DD');
      return `Check-in between ${startDate} to ${endDate}`;
    }

    return '';
  };

  
  
  return (
    <div>
         {loading ? (
        <div className="flex justify-center items-center h-screen">
          <button type="button"
            className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
            Loading
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
              <path fillRule="evenodd"
                d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.376-1.453A8.978 8.978 0 0 1 21 12a9 9 0 0 1-4.874 8l.117.03a1 1 0 0 1 .727 1.213 1 1 0 0 1-1.213.727l-4-1a1 1 0 0 1-.59-1.525l2-3a1 1 0 0 1 1.665 1.11l-.755 1.132a7.003 7.003 0 0 0 2.735-11.77z"
                clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
      <section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <form action="#" class="mx-auto max-w-screen-xl px-4 2xl:px-0">
   

    <div class="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
      <div class="min-w-0 flex-1 space-y-8">
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Your Details</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="your_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your name </label>
              <input      value={name} 
      onChange={(e) => setName(e.target.value)} 
      type="text" 
      placeholder="Enter name" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"  required />
            </div>

            <div>
              <label for="your_email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your email* </label>
              <input   value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      type="email" 
      placeholder="Email address" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"  required />
            </div>

            

           

            <div>
              <label for="phone-input-3" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Phone Number* </label>
              <div class="flex items-center">
             
                <div id="dropdown-phone-3" class="z-10 hidden w-56 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700">
                  <ul class="p-2 text-sm font-medium text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-phone-button-2">
                    <li>
                      <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                        <span class="inline-flex items-center">
                          <svg fill="none" aria-hidden="true" class="me-2 h-4 w-4" viewBox="0 0 20 15">
                            <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                            <mask id="a"  width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                              <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                            </mask>
                            <g mask="url(#a)">
                              <path fill="#D02F44" fill-rule="evenodd" d="M19.6.5H0v.933h19.6V.5zm0 1.867H0V3.3h19.6v-.933zM0 4.233h19.6v.934H0v-.934zM19.6 6.1H0v.933h19.6V6.1zM0 7.967h19.6V8.9H0v-.933zm19.6 1.866H0v.934h19.6v-.934zM0 11.7h19.6v.933H0V11.7zm19.6 1.867H0v.933h19.6v-.933z" clip-rule="evenodd" />
                              <path fill="#46467F" d="M0 .5h8.4v6.533H0z" />
                              <g filter="url(#filter0_d_343_121520)">
                                <path
                                  fill="url(#paint0_linear_343_121520)"
                                  fill-rule="evenodd"
                                  d="M1.867 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.866 0a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM7.467 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zM2.333 3.3a.467.467 0 100-.933.467.467 0 000 .933zm2.334-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.4.467a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm-2.334.466a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.466a.467.467 0 11-.933 0 .467.467 0 01.933 0zM1.4 4.233a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM6.533 4.7a.467.467 0 11-.933 0 .467.467 0 01.933 0zM7 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zM3.267 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0z"
                                  clip-rule="evenodd"
                                />
                              </g>
                            </g>
                            <defs>
                              <linearGradient id="paint0_linear_343_121520" x1=".933" x2=".933" y1="1.433" y2="6.1" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#fff" />
                                <stop offset="1" stop-color="#F0F0F0" />
                              </linearGradient>
                              <filter id="filter0_d_343_121520" width="6.533" height="5.667" x=".933" y="1.433" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                                <feOffset dy="1" />
                                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_343_121520" />
                                <feBlend in="SourceGraphic" in2="effect1_dropShadow_343_121520" result="shape" />
                              </filter>
                            </defs>
                          </svg>
                          (+91)
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
                <div class="relative w-full">
                  <input      value={mobilenumber} 
      onChange={(e) => setMobileNumber(e.target.value)} 
      type="number" 
      placeholder="Phone number" class="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-emerald-500" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"  required />
                </div>
              </div>
            </div>

            <div>
              <label for="address" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Address </label>
              <textarea     value={address} 
      onChange={(e) => setAddress(e.target.value)} 
      placeholder="Address" class="block h-24 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"  required > </textarea>
            </div>

          

            <div class="sm:col-span-2">
            <div class="col-span-1">
        <h3 class="text-xl font-bold text-[#333]">Booking Summary</h3>
    </div>
    <div class="col-span-2">
        <div class="flex flex-wrap items-start pb-4 mb-10 border-b border-gray-200 dark:border-gray-700">
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400 font-mono">Name:{Name}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400 font-mono">Location:{location}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="text-base leading-6 text-blue-600 dark:text-gray-400 font-mono">Type:{roomType}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400 font-mono">Price: Rs.{roomprice}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400 font-mono">Check In at:{checkInDate}</p>
            </div>
        </div>
    </div>
            </div>
          </div>
        </div>

     

        <div>
          <label for="voucher" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Enter a gift card, voucher or promotional code </label>
          <div class="flex max-w-md items-center gap-4">
            <input value={couponCode} 
      onChange={(e) => setCouponCode(e.target.value)} 
      placeholder='ENTER COUPON CODE'  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"  /> {!appliedCoupon ? (
        <button
        onClick={() => applyCoupon(couponCode)} 
          className="flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
        >
          Apply
        </button>
      ) : (
        <div className="flex items-center justify-center rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          Applied
        </div>
      )}
    
          </div>
        </div>
      </div>

      <div class="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
        <div class="flow-root">
          <div class="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Subtotal</dt>
              <dd class="text-base font-medium text-gray-900 dark:text-white">{roomprice}</dd>
            </dl>

            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
              <dd class="text-base font-medium text-green-500">- ₹{savings.toFixed(2)}</dd>
            </dl>

            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Arene Service Charge</dt>
              <dd class="text-base font-medium text-gray-900 dark:text-white">350</dd>
            </dl>

            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Donate</dt>
              <dd class="text-base font-medium text-gray-900 dark:text-white">₹{includeDonation ? 1 : 0}</dd>
            </dl>

            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-bold text-gray-900 dark:text-white">Total</dt>
              <dd class="text-base font-bold text-gray-900 dark:text-white">  ₹{getPaymentAmount().total.toFixed(2)} </dd>
            </dl>
            <p> <h3 className='font-semibold font-mono' >You Pay Now: ₹{getPaymentAmount().paymentAmount} || Pay at Check-In: ₹{getPaymentAmount().payAtCheckIn}</h3> {/* This shows the amount to pay now */}
            </p>
            <p className="text-red-600 font-mono">
        **Please ensure to complete the payment of ₹{getPaymentAmount().paymentAmount} at the time of booking and the remaining ₹{getPaymentAmount().payAtCheckIn} at the time of check-in.**
      </p>
          </div>
        </div>
        <div className="mb-4">
      <label className="block text-gray-700">Payment Option</label>
      <div className="mt-1">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="paymentOption"
            value="oneday"
            checked={paymentOption === "oneday"}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="form-radio"
          />
          <span className="text-md ml-2 font-bold font-mono">{getDateRange(paymentOption)}</span>
        </label>
        <label className="inline-flex items-center ">
          <input
            type="radio"
            name="paymentOption"
            value="threeday"
            checked={paymentOption === "threeday"}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="form-radio"
          />
          <span className="ml-2 text-md font-bold font-mono">{getDateRange(paymentOption)}</span>
        </label>
        <label className="inline-flex items-center ">
          <input
            type="radio"
            name="paymentOption"
            value="allday"
            checked={paymentOption === "allday"}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="form-radio"
          />
          <span className="ml-2 text-md font-bold font-mono"> {getDateRange(paymentOption)}</span>
        </label>
      </div>
      {/* <div className="mt-4">
        <p className="text-gray-600">{getDateRange(paymentOption)}</p>
      </div> */}
    </div>

        <div className="mb-4 flex mt-4">
            <input
              type="checkbox"
              checked={includeDonation}
              onChange={(e) => setIncludeDonation(e.target.checked)}
              className="mr-2"
            />
            <span>Add 1 rupee to donate</span>
          </div>
        <div class="space-y-3">
          <button onClick={initiatePayment}  class="flex w-full items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-4  focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">Proceed to Payment</button>

        </div>
      </div>
    </div>
  </form>
</section>
      )}
      <ToastContainer/>
    </div>
  )
}

export default Booking