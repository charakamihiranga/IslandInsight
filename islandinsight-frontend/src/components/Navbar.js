import React, { useState } from 'react';
import './../styles/general.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 md:py-6 sticky top-0 left-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 xl:px-[195px] relative">
        <a href="#" className="text-red-600 font-Pacifico text-2xl">
          Island Insight
        </a>
        <div className="hidden md:flex border border-[#B4A8A8] h-5 ml-6"></div>
        <div className="hidden md:flex space-x-12 ml-6 justify-start flex-grow lg:ml-12 xl:ml-[56px]">
          <a href="#" className="text-gray-700 hover:text-red-600 roboto-medium">Latest</a>
          <a href="#" className="text-gray-700 hover:text-red-600 roboto-medium">Business</a>
          <a href="#" className="text-gray-700 hover:text-red-600 roboto-medium">Technology</a>
          <a href="#" className="text-gray-700 hover:text-red-600 roboto-medium">Sport</a>
        </div>
        <div className="flex space-x-4">
          <button
            className="hidden md:block bg-black text-white text-xs roboto-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            onClick={() => alert('Login')}
          >
            LOGIN
          </button>
          <button
            className={`md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-red-600 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
            onClick={toggleMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white border-t border-gray-200 transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} w-full`}>
        <div className="flex flex-col space-y-4 py-5 px-4 sm:px-6 lg:px-8">
          <a href="#" className="text-gray-700 hover:text-red-600">Latest</a>
          <a href="#" className="text-gray-700 hover:text-red-600">Business</a>
          <a href="#" className="text-gray-700 hover:text-red-600">Technology</a>
          <a href="#" className="text-gray-700 hover:text-red-600">Sport</a>
          <div className="flex flex-col space-y-4">
            <button
              className="bg-black text-white text-xs roboto-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
              onClick={() => alert('Login')}
            >
              LOGIN
            </button>
            <button
              className="bg-gray-300 text-black text-xs roboto-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300"
              onClick={() => alert('Signup')}
            >
              SIGNUP
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
