import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./../assets/styles/general.css";
import closeIcon from "./../assets/Close.png";
import eyeIcon from "./../assets/eye.png";


const LoginPane = ({ isOpen, onClose, openSignUpPane }) => {
  const [closing, setClosing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const handleLogin = async () => {
    try {
      await login(email, password);
      handleClose(); 
    } catch (error) {

    }
  };

  const handleMouseDown = () => {
    setPasswordVisible(true);
  };

  const handleMouseUp = () => {
    setPasswordVisible(false);
  };

  useEffect(() => {
    if (!isOpen) setClosing(false);
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setEmail("");      
      setPassword("");   
      setClosing(false);
    }, 300); 
  };

  if (!isOpen && !closing) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
        isOpen && !closing
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white p-8 rounded-2xl shadow-lg relative transition-transform duration-300 ease-in-out ${
          isOpen && !closing ? "zoom-in" : "zoom-out"
        }`}
      >
        <button
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 transition-transform transform hover:scale-110"
          onClick={handleClose}
        >
          <img src={closeIcon} alt="Close" className="h-6 w-6 fill-current" />
        </button>

        <div className="flex flex-col items-center cursor-pointer ">
          <h1 className="text-3xl text-center font-Pacifico text-[#E51B21] ">
            Island Insight
          </h1>
          <div className="flex items-center mt-2">
            <div className="w-24 h-0.5 bg-[#E51B21]"></div>
            <div className="ml-4 font-roboto font-bold text-xs text-gray-700">
              Login form
            </div>
          </div>
          <div>
            <h3 className="roboto-bold mt-8">
              Your fastest, most trusted source for News
            </h3>
            <p className="roboto-bold text-xs text-gray-600">
              Login to stay ahead
            </p>
          </div>
        </div>
        <div className="display-block mt-8 ">
          <p className="text-xs roboto-bold mt-2 text-gray-700 ml-10">
            Email or phone number
          </p>
          <input
            className="w-[96%] h-10 mt-2 ml-3 rounded-3xl border-none bg-[#d9d9d9] pl-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-xs mt-4 roboto-bold text-gray-700 ml-10">
            Password
          </p>
          <div className="relative w-[96%] mt-2 ml-3">
            <input
              className="w-full h-10 rounded-3xl border-none bg-[#d9d9d9] pl-4 pr-10"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={eyeIcon}
              alt="Toggle visibility"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer h-4 mr-2"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            />
          </div>
          <div className="flex justify-end">
            <p className="text-[10px] roboto-medium text-gray-700 cursor-pointer mt-2 hover:underline mr-6">
              Forgot password?
            </p>
          </div>
          <button
            className="w-full bg-[#E51B21] text-white roboto-bold text-xs p-2.5 rounded-3xl mt-4 cursor-pointer hover:bg-[#d91c27] hover:shadow-lg transition duration-300 ease-in-out"
            onClick={handleLogin}
          >
            LOGIN
          </button>
          <div className="mt-6 flex">
            <div className="w-[8vw] mt-2 h-[1.5px] bg-[#716868]"></div>
            <p className="roboto-bold text-xs text-gray-700 mx-3">
              {" "}
              To create an account
            </p>
            <div className="w-[8vw] mt-2 h-[1.5px] bg-[#716868]"></div>
          </div>
          <button
            className="w-full bg-[#D9D9D9] text-[#000] mb-4 roboto-bold text-xs p-2.5 rounded-3xl mt-4 cursor-pointer hover:bg-[#B0B0B0] hover:shadow-lg transition duration-300 ease-in-out"
            onClick={openSignUpPane}
          >
            SIGNUP
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPane;
