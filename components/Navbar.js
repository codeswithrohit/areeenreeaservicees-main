import { useState, useEffect, useRef } from "react";
import { firebase } from "../Firebase/config";
import {  FaUserCircle, FaSignInAlt, FaChevronDown, FaBars, FaTimes,FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [dropdown, setDropdown] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSignInDropdown, setShowSignInDropdown] = useState(false); // New state for dropdown visibility

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid); // Fetch user data based on UID
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);
  

  // Function to fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData && userData.photoURL) {
          setUserData(userData);
        } else {
          // If photoURL is missing or undefined, set it to a default value or null
          setUserData({ ...userData, photoURL: null }); // You can set a default value or handle it as per your requirement
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };



  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true); // Set state to indicate logout is in progress
      await firebase.auth().signOut(); // Perform the logout action using Firebase Auth
      // Additional cleanup or state resetting if needed after logout

      setLoggingOut(false); // Reset state after successful logout
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      setLoggingOut(false); // Reset state in case of an error during logout
    }
  };

  const toggleDropdown = (menu) => {
    setDropdown(dropdown === menu ? null : menu);
  };

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };


  const router = useRouter();

  const handlebuypropertiesClick = (subcategory) => {
    router.push({
      pathname: '/Allbuysubcat',
      query: { subcategory },
    });
    closeMobileMenu(); // Close Mobile Menu on Click
  };

  const handleClick = (subcategory) => {
    router.push({
      pathname: '/Allrentsubcat',
      query: { subcategory },
    });
    closeMobileMenu(); // Close Mobile Menu on Click
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-lg font-roboto">
      {/* Navbar Top Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        {/* Logo */}
        <a href='/' >
        <div className="text-3xl font-bold cursor-pointer">
          <img src="/icon.png" alt="Logo" className="h-12 w-auto" />
        </div>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-8 items-center text-lg font-medium">
          {/* PG Dropdown */}
          <a href="/about"><li className="hover:text-gray-200">About Us</li></a>
          <li     className="relative group"
            onMouseEnter={() => setDropdown('PG')}
            onMouseLeave={() => setDropdown(null)}>
            <button onClick={() => toggleDropdown('PG')} className="flex items-center space-x-1 hover:text-gray-200">
              PG <FaChevronDown className="text-sm" />
            </button>
            {dropdown === 'PG' && (
              <ul className="absolute bg-white flex flex-col text-gray-800 shadow-lg rounded-md w-48 mt-2 z-50">
                <a href="/PGboy"><li className="px-4 py-2 hover:bg-gray-100">Boys</li></a>
                <a href="/PGgirl"><li className="px-4 py-2 hover:bg-gray-100">Girls</li></a>
              </ul>
            )}
          </li>

          {/* Buy Properties Dropdown */}
          <li       className="relative group"
            onMouseEnter={() => setDropdown('Buy')}
            onMouseLeave={() => setDropdown(null)}>
            <button onClick={() => toggleDropdown('Buy')} className="flex items-center space-x-1 hover:text-gray-200">
              Buy Properties <FaChevronDown className="text-sm" />
            </button>
            {dropdown === 'Buy' && (
              <ul className="absolute bg-white text-gray-800 shadow-lg rounded-md w-48 mt-2 z-50">
                {['Appartment', 'Builder Floor', 'Bunglow', 'Shop/Showroom', 'Office Space', 'Go Down', 'Land', 'Villas'].map((item) => (
                  <li key={item} onClick={() => handlebuypropertiesClick(item)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Rent Properties Dropdown */}
          <li   className="relative group"
            onMouseEnter={() => setDropdown('Rent')}
            onMouseLeave={() => setDropdown(null)}>
            <button onClick={() => toggleDropdown('Rent')} className="flex items-center space-x-1 hover:text-gray-200">
              Rent Properties <FaChevronDown className="text-sm" />
            </button>
            {dropdown === 'Rent' && (
              <ul className="absolute bg-white text-gray-800 shadow-lg rounded-md w-48 mt-2 z-50">
                {['Appartment', 'Builder Floor', 'Bunglow', 'Shop/Showroom', 'Office Space', 'Go Down', 'Villas'].map((item) => (
                  <li key={item} onClick={() => handleClick(item)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <a href="/alllaundry"><li className="hover:text-gray-200">Laundry</li></a>
          <a href="/arenechef"><li className="hover:text-gray-200">Arena Chef</li></a>
          <a href="/contact"><li className="hover:text-gray-200">Contact</li></a>
        </ul>

        {/* User Icon */}
        <div className="hidden lg:block relative">
          {userData ? (
            <div
              className="relative"
              onMouseEnter={() => setShowSignInDropdown(true)}  // Show dropdown on hover
              onMouseLeave={() => setShowSignInDropdown(false)} // Hide dropdown when hover ends
            >
              <FaUserCircle size={30} className="cursor-pointer hover:text-gray-200" />
              {showSignInDropdown && (
                <ul className="absolute  bg-white text-gray-800 shadow-lg rounded-md w-64 mt-0 z-50">
                  <li className="px-4 py-2 text-lg font-bold">Welcome, {userData.name}</li>
                  <a  href="/dashboard" >
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2">
                    <FaSignInAlt className="text-sm" />
                    <span>Dashboard</span>
                  </li>
                  </a>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Logout</span>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setShowSignInDropdown(true)}  // Show dropdown on hover
              onMouseLeave={() => setShowSignInDropdown(false)} // Hide dropdown when hover ends
            >
              <FaSignInAlt size={30} className="cursor-pointer hover:text-gray-200" />
              {showSignInDropdown && (
                <ul className="absolute bg-white text-sm right-0 font-bold uppercase text-gray-800 shadow-lg rounded-md w-48 mt-0 z-50">
                        <a href="/signin" ><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In as User</li></a>
                 <a href="/Deliveryboy/loginregister" >
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In as Delivery Boy</li>
                  </a>
                  <a href="/AreneChefVendor/loginregister" >
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In as Arena Chef Vendor</li>
                  </a>
                  <a href="/ArenelaundryVendor/loginregister" >
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In as Arena Laundry Vendor</li>
                  </a>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div>
        <button onClick={toggleMobileMenu} className="lg:hidden text-2xl">
        {userData ? (
            <div
              className="relative"
              onMouseEnter={() => setShowSignInDropdown(true)}  // Show dropdown on hover
              onMouseLeave={() => setShowSignInDropdown(false)} // Hide dropdown when hover ends
            >
              <FaUserCircle size={30} className="cursor-pointer hover:text-gray-200" />
              {showSignInDropdown && (
                <ul className="absolute text-xs right-0 bg-white text-gray-800 shadow-lg rounded-md w-64 mt-0 z-50">
                  <li className="px-4 py-2 text-lg font-bold">Welcome, {userData.name}</li>
                  <a  href="/dashboard" >
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2">
                    <FaSignInAlt className="text-sm" />
                    <span>Dashboard</span>
                  </li>
                  </a>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Logout</span>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setShowSignInDropdown(true)}  // Show dropdown on hover
              onMouseLeave={() => setShowSignInDropdown(false)} // Hide dropdown when hover ends
            >
              <FaSignInAlt size={30} className="cursor-pointer hover:text-gray-200" />
              {showSignInDropdown && (
                <ul className="absolute bg-white text-sm right-0 font-bold uppercase text-gray-800 shadow-lg rounded-md w-48 mt-0 z-50">
                 <a href="/signin" ><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In as User</li></a>
                 <a href="/Deliveryboy/loginregister" >
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In as Delivery Boy</li>
                  </a>
                  <a href="/AreneChefVendor/loginregister" >
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In as Arena Chef Vendor</li>
                  </a>
                  <a href="/ArenelaundryVendor/loginregister" >
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In as Arena Laundry Vendor</li>
                  </a>
                </ul>
              )}
            </div>
          )}
        </button>
        <button onClick={toggleMobileMenu} className="lg:hidden text-2xl ml-4">
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
        </div>
    
      </div>

      {/* Mobile Sidebar Menu */}
      {mobileMenu && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 transition-opacity duration-500 ease-in-out">
    <div className="bg-white w-80 h-full shadow-xl overflow-y-auto transform transition-transform duration-500 ease-in-out translate-x-0">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 bg-emerald-600 text-white shadow-md">
        <div className="text-3xl font-bold cursor-pointer">
          <img src="/icon.png" alt="Logo" className="h-12 w-auto" />
        </div>
        <button onClick={toggleMobileMenu} className="text-white hover:text-gray-200 transition-colors duration-300">
          <FaTimes size={24} />
        </button>
      </div>

      {/* Menu List */}
      <ul className="flex flex-col text-gray-800">
        {/* PG */}
        <li className="border-b border-gray-200">
          <button
            onClick={() => toggleDropdown('PG')}
            className="w-full font-bold text-left px-4 py-2 flex justify-between items-center hover:bg-gray-100 transition-colors duration-300"
          >
            PG <FaChevronDown />
          </button>
          {dropdown === 'PG' && (
            <ul className="ml-4 flex flex-col">
              <a href="/PGboy">
                <li className="px-4 py-2 font-bold hover:bg-gray-100 transition-colors duration-300">Boys</li>
              </a>
              <a href="/PGgirl">
                <li className="px-4 py-2 font-bold hover:bg-gray-100 transition-colors duration-300">Girls</li>
              </a>
            </ul>
          )}
        </li>

        {/* Buy Properties */}
        <li className="border-b border-gray-200">
          <button
            onClick={() => toggleDropdown('Buy')}
            className="w-full font-bold text-left px-4 py-2 flex justify-between items-center hover:bg-gray-100 transition-colors duration-300"
          >
            Buy Properties <FaChevronDown />
          </button>
          {dropdown === 'Buy' && (
            <ul className="ml-4">
              {['Appartment', 'Builder Floor', 'Bunglow', 'Shop/Showroom', 'Office Space', 'Go Down', 'Land', 'Villas'].map((item) => (
                <li
                  key={item}
                  onClick={() => handlebuypropertiesClick(item)}
                  className="px-4 py-2 font-bold hover:bg-gray-100 cursor-pointer transition-colors duration-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Rent Properties */}
        <li className="border-b border-gray-200">
          <button
            onClick={() => toggleDropdown('Rent')}
            className="w-full font-bold text-left px-4 py-2 flex justify-between items-center hover:bg-gray-100 transition-colors duration-300"
          >
            Rent Properties <FaChevronDown />
          </button>
          {dropdown === 'Rent' && (
            <ul className="ml-4">
              {['Appartment', 'Builder Floor', 'Bunglow', 'Shop/Showroom', 'Office Space', 'Go Down', 'Villas'].map((item) => (
                <li
                  key={item}
                  onClick={() => handleClick(item)}
                  className="px-4 py-2 font-bold hover:bg-gray-100 cursor-pointer transition-colors duration-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Arena Laundry */}
        <a href="/alllaundry">
          <li className="w-full text-left font-bold px-4 py-2 hover:bg-gray-100 transition-colors duration-300 border-b border-gray-200">
            Arena Laundry
          </li>
        </a>

        {/* Arena Chef */}
        <a href="/arenechef">
          <li className="w-full text-left px-4 py-2 font-bold hover:bg-gray-100 transition-colors duration-300 border-b border-gray-200">
            Arena Chef
          </li>
        </a>

        {/* Contact */}
        <a href="/contact">
          <li className="w-full text-left px-4 py-2 font-bold hover:bg-gray-100 transition-colors duration-300 border-b border-gray-200">
            Contact
          </li>
        </a>
      </ul>
    </div>
  </div>
)}

    </nav>
  );
};

export default Navbar;
