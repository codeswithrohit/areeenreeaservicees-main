import React, { useState } from 'react';
import { FaBars, FaTimes, FaUsers, FaCalendarAlt, FaList, FaChartLine } from 'react-icons/fa';
import { MdArrowDropDown, MdArrowDropUp,MdAddHomeWork,MdOutlineLocalLaundryService } from 'react-icons/md';
import { RiHomeSmileFill } from "react-icons/ri";
import { SiCodechef } from "react-icons/si";
import { BsMenuDown } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
const AdminNavbar = () => {
  // State to manage the visibility of the sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownUsersOpen, setDropdownUsersOpen] = useState(false);
  const [dropdownlaundryOpen, setDropdownlaundryOpen] = useState(false);
  const [dropdownchefOpen, setDropdownchefOpen] = useState(false);
  const [dropdownothersOpen, setDropdownothersOpen] = useState(false);
  const [dropdownPropertyOpen, setDropdownPropertyOpen] = useState(false);

  // Toggle function for sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle function for Users dropdown
  const toggleUsersDropdown = () => {
    setDropdownUsersOpen(!dropdownUsersOpen);
  };

  // Toggle function for Property dropdown
  const togglePropertyDropdown = () => {
    setDropdownPropertyOpen(!dropdownPropertyOpen);
  };

  const togglelaundryDropdown = () => {
    setDropdownlaundryOpen(!dropdownlaundryOpen);
  };
  const togglechefDropdown = () => {
    setDropdownchefOpen(!dropdownchefOpen);
  };
  const toggleothersDropdown = () => {
    setDropdownothersOpen(!dropdownothersOpen);
  };

  return (
    <div>
      <button
  onClick={toggleSidebar}
  aria-controls="default-sidebar"
  type="button"
  className="inline-flex items-center p-2 mt-2 ml-3 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
>
  <span className="sr-only">Open sidebar</span>
  <FaBars className="w-6 h-6" />
</button>

      <h1 className='text-lg font-bold font-mono text-center underline'>Admin Panel</h1>
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
        aria-label="Sidenav"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <button
            type="button"
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <span className="sr-only">Close sidebar</span>
            <FaTimes className="w-6 h-6" />
          </button>
          <ul className="space-y-2">
            <h1 className='text-lg font-bold font-mono text-center underline'>Admin Panel</h1>
            <li>
              <a
                href="/Admin"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaChartLine className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">Overview</span>
              </a>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={toggleUsersDropdown}
              >
                <FaUsers className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">Users</span>
                {dropdownUsersOpen ? (
                  <MdArrowDropUp className="w-6 h-6" />
                ) : (
                  <MdArrowDropDown className="w-6 h-6" />
                )}
              </button>
              <ul
                id="dropdown-Users"
                className={`py-2 space-y-2 ${dropdownUsersOpen ? 'block' : 'hidden'}`}
              >
                <li>
                  <a
                    href="/Admin/Users"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Users
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/AreneChefVendor"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Arene Chef Vendor
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/ArenelaundryVendor"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                 Arene Laundry vendor
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/Deliveryboy"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                 Delivery Boy
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={togglePropertyDropdown}
              >
                <MdAddHomeWork className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">Property</span>
                {dropdownPropertyOpen ? (
                  <MdArrowDropUp className="w-6 h-6" />
                ) : (
                  <MdArrowDropDown className="w-6 h-6" />
                )}
              </button>
              <ul
                id="dropdown-Property"
                className={`py-2 space-y-2 ${dropdownPropertyOpen ? 'block' : 'hidden'}`}
              >
                <li>
                  <a
                    href="/Admin/PGData"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    PG
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/BuyData"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Buy
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/RentData"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Rent
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/HotelData"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Hotel
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/PGDaBanqueethall"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Banqueethall
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/Resort"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Resort
                  </a>
                </li>
               
              </ul>
            </li>
            <li>
              <a
                href="/Admin/Propertyenquiry"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <RiHomeSmileFill  className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">Property Enquiry</span>
              </a>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={togglelaundryDropdown}
              >
                <MdOutlineLocalLaundryService className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">Arene Laundry</span>
                {dropdownlaundryOpen ? (
                  <MdArrowDropUp className="w-6 h-6" />
                ) : (
                  <MdArrowDropDown className="w-6 h-6" />
                )}
              </button>
              <ul
                id="dropdown-laundry"
                className={`py-2 space-y-2 ${dropdownlaundryOpen ? 'block' : 'hidden'}`}
              >
                <li>
                  <a
                    href="/Admin/laundry"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Laundry
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/arenelaundryorder"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Arene Laundry Order
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={togglechefDropdown}
              >
                <SiCodechef  className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">Arene Chef</span>
                {dropdownchefOpen ? (
                  <MdArrowDropUp className="w-6 h-6" />
                ) : (
                  <MdArrowDropDown className="w-6 h-6" />
                )}
              </button>
              <ul
                id="dropdown-chef"
                className={`py-2 space-y-2 ${dropdownchefOpen ? 'block' : 'hidden'}`}
              >
                <li>
                  <a
                    href="/Admin/CloudKitchen"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Chef
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/arenecheforder"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Arene Chef Order
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={toggleothersDropdown}
              >
                <BsMenuDown  className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">Others</span>
                {dropdownothersOpen ? (
                  <MdArrowDropUp className="w-6 h-6" />
                ) : (
                  <MdArrowDropDown className="w-6 h-6" />
                )}
              </button>
              <ul
                id="dropdown-others"
                className={`py-2 space-y-2 ${dropdownothersOpen ? 'block' : 'hidden'}`}
              >
                <li>
                  <a
                    href="/Admin/CoupanCode"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                  Coupon Code
                  </a>
                </li>
                <li>
                  <a
                    href="/Admin/Enquiry"
                    className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                   Enquiry
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <BiLogOutCircle className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AdminNavbar;
