// components/Header.js

import { useState } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import { HiX } from 'react-icons/hi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const [isBlogDropdownOpen, setIsBlogDropdownOpen] = useState(false);

  return (
    <header className="flex border-b bg-white font-sans min-h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between px-10 py-3 gap-4 w-full">
        <a href="#">
          <img src="https://readymadeui.com/readymadeui.svg" alt="logo" width={144} height={36} className="w-36" />
        </a>

        <button
          id="toggleOpen"
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <IoMenu className="w-7 h-7" />
        </button>

        <div
          id="collapseMenu"
          className={`lg:flex lg:gap-x-10 ${isMenuOpen ? 'fixed top-0 left-0 w-1/2 min-w-[300px] bg-white p-6 h-full shadow-md z-50' : 'hidden'} max-lg:space-y-3 max-lg:overflow-auto`}
        >
          <button
            id="toggleClose"
            className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <HiX className="w-4 fill-black" />
          </button>

          <ul className="flex flex-col lg:flex-row lg:space-x-10 max-lg:space-y-3">
            <li className="mb-6 hidden max-lg:block">
              <a href="#">
                <img src="https://readymadeui.com/readymadeui.svg" alt="logo" width={144} height={36} className="w-36" />
              </a>
            </li>
            <li className="max-lg:border-b max-lg:py-3">
              <a href="#" className="hover:text-blue-600 text-[15px] font-bold text-blue-600 block">Home</a>
            </li>
            <li className="group max-lg:border-b max-lg:py-3 relative">
              <button 
                onClick={() => setIsPagesDropdownOpen(!isPagesDropdownOpen)}
                className="w-full text-left flex items-center justify-between hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">
                Pages
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" className="ml-1 inline-block" viewBox="0 0 24 24">
                  <path d="M12 16a1 1 0 0 1-.71-.29l-6-6a1 1 0 0 1 1.42-1.42l5.29 5.3 5.29-5.29a1 1 0 0 1 1.41 1.41l-6 6a1 1 0 0 1-.7.29z" />
                </svg>
              </button>
              <ul className={`absolute shadow-lg bg-white space-y-3 lg:top-5 max-lg:top-8 -left-6 min-w-[250px] z-50 transition-all duration-500 ${isPagesDropdownOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} px-6`}>
                <li className="border-b py-2">
                  <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">About</a>
                </li>
                <li className="border-b py-2">
                  <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">Contact</a>
                </li>
                <li className="border-b py-2">
                  <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">Login</a>
                </li>
                <li className="border-b py-2">
                  <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">Sign up</a>
                </li>
                <li className="border-b py-2">
                  <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">Blog</a>
                </li>
              </ul>
            </li>
            <li className="group max-lg:border-b max-lg:py-3 relative">
              <button 
                onClick={() => setIsBlogDropdownOpen(!isBlogDropdownOpen)}
                className="w-full text-left flex items-center justify-between hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">
                Blog
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" className="ml-1 inline-block" viewBox="0 0 24 24">
                  <path d="M12 16a1 1 0 0 1-.71-.29l-6-6a1 1 0 0 1 1.42-1.42l5.29 5.3 5.29-5.29a1 1 0 0 1 1.41 1.41l-6 6a1 1 0 0 1-.7.29z" />
                </svg>
              </button>
              <ul className={`absolute shadow-lg bg-white space-y-3 lg:top-5 max-lg:top-8 -left-6 min-w-[250px] z-50 transition-all duration-500 ${isBlogDropdownOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} px-6`}>
                <li className="border-b py-2">
                  <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">Foods</a>
                </li>
                <li className="border-b py-2">
                  <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">Sale</a>
                </li>
                <li className="border-b py-2">
                  <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">Marketing</a>
                </li>
                <li className="border-b py-2">
                  <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">Investment</a>
                </li>
              </ul>
            </li>
            <li className="max-lg:border-b max-lg:py-3">
              <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">Team</a>
            </li>
            <li className="max-lg:border-b max-lg:py-3">
              <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">About</a>
            </li>
            <li className="max-lg:border-b max-lg:py-3">
              <a href="#" className="hover:text-[#007bff] text-gray-600 text-[15px] font-bold block">Contact</a>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-8 max-lg:ml-auto">
          <span className="relative">
            <FaShoppingCart className="cursor-pointer fill-[#333] hover:fill-[#007bff] inline" size={20} />
            <span className="absolute left-auto -ml-1 top-0 rounded-full bg-black px-1 py-0 text-xs text-white">0</span>
          </span>

          <span className="relative">
            <FaUserCircle className="cursor-pointer fill-[#333] hover:fill-[#007bff] inline" size={20} />
            <span className="absolute left-auto -ml-1 top-0 rounded-full bg-black px-1 py-0 text-xs text-white">0</span>
          </span>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="20px" className="cursor-pointer fill-[#333] hover:fill-[#007bff]">
            <path d="m190.707 180.101-47.078-47.077c11.702-14.37 18.568-33.42 18.568-53.595 0-46.683-37.965-84.768-84.768-84.768-22.228 0-42.168 8.767-57.268 23.361l-48.633-48.631c-8.423-8.425-22.114-8.425-30.537 0-8.423 8.423-8.423 22.114 0 30.537l64.343 64.343c-11.702 14.37-18.568 33.42-18.568 53.595 0 46.683 37.965 84.768 84.768 84.768 22.228 0 42.168-8.767 57.268-23.361l48.633 48.631c8.423 8.425 22.114 8.425 30.537 0 8.423-8.423 8.423-22.114 0-30.537z" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
