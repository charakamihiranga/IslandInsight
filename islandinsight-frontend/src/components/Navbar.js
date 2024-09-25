import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import your AuthContext
import LoginPane from "./LoginPane";
import SignUpPane from "./SignUpPane";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPane, setShowLoginPane] = useState(false);
  const [showSignUpPane, setShowSignUpPane] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Access current user from AuthContext
  const { currentUser, logout } = useAuth(); // Ensure logout is available from context

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLoginPane = () => {
    setShowSignUpPane(false);
    setShowLoginPane(!showLoginPane);
  };

  const openSignUpPane = () => {
    setShowSignUpPane(true);
    setShowLoginPane(false);
  };

  const closePanes = () => {
    setShowLoginPane(false);
    setShowSignUpPane(false);
  };

  const handleLogout = async () => {
    await logout(); // Call logout function from AuthContext
    setDropdownOpen(false); // Close dropdown after logout
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 py-4 md:py-6 sticky top-0 left-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 xl:px-[195px] relative">
          <a href="#" className="text-red-600 font-Pacifico text-2xl">
            Island Insight
          </a>
          <div className="hidden md:flex border border-[#B4A8A8] h-5 ml-6"></div>
          <ul className="hidden md:flex space-x-12 ml-6 justify-start flex-grow lg:ml-12 xl:ml-[56px]">
            <li><a href="#" className="text-gray-700 hover:text-red-600 roboto-medium">Latest</a></li>
            <li><a href="#" className="text-gray-700 hover:text-red-600 roboto-medium">Business</a></li>
            <li><a href="#" className="text-gray-700 hover:text-red-600 roboto-medium">Technology</a></li>
            <li><a href="#" className="text-gray-700 hover:text-red-600 roboto-medium">Sport</a></li>
          </ul>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="relative hidden md:flex">
                <img
                  src={currentUser.photoURL || "/default-profile.png"}
                  alt="User profile"
                  className="w-10 h-10 md:w-8 md:h-8 rounded-full transition-transform duration-200 hover:scale-110 cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="absolute left-5 mt-8 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                        {currentUser.displayName} {/* Display username */}
                      </div>
                      <div 
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </div>
                      <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                        Settings
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="hidden md:block bg-black text-white text-xs roboto-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                onClick={toggleLoginPane}
              >
                LOGIN
              </button>
            )}

            <button
              className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-red-600 transition-transform duration-300"
              onClick={toggleMenu}
              aria-expanded={isOpen}
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
        <div
          className={`md:hidden ${isOpen ? "block" : "hidden"} bg-white border-t border-gray-200 transition-transform duration-500 ease-in-out transform ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          } w-full`}
        >
          <div className="flex flex-col space-y-4 py-5 px-4 sm:px-6 lg:px-8">
            <a href="#" className="text-gray-700 hover:text-red-600">Latest</a>
            <a href="#" className="text-gray-700 hover:text-red-600">Business</a>
            <a href="#" className="text-gray-700 hover:text-red-600">Technology</a>
            <a href="#" className="text-gray-700 hover:text-red-600">Sport</a>
            <div className="flex flex-col space-y-4">
              {currentUser ? (
                <>
                  <div className="text-gray-700 hover:text-red-600 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    My Profile
                  </div>
                  <button
                    className="bg-red-600 font-Pacifico text-white text-xs roboto-bold py-2 px-4 rounded-lg hover:bg-red-800 transition-colors duration-300"
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-black text-white text-xs roboto-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                    onClick={toggleLoginPane}
                  >
                    LOGIN
                  </button>
                  <button
                    className="bg-gray-300 text-black text-xs roboto-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                    onClick={openSignUpPane}
                  >
                    SIGNUP
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Pane components */}
      <LoginPane isOpen={showLoginPane} onClose={toggleLoginPane} openSignUpPane={openSignUpPane} />
      <SignUpPane isOpen={showSignUpPane} onClose={closePanes} />
    </>
  );
};

export default Navbar;
