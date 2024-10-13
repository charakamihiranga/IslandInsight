import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./../assets/styles/general.css";
import closeIcon from "./../assets/Close.png";
import eyeIcon from "./../assets/eye.png";
import appleLogo from "./../assets/Apple Logo.png";
import facebookLogo from "./../assets/Facebook.png";
import googleLogo from "./../assets/Google.png";
import leftArrow from "./../assets/left-arrrow.png";
import "./../assets/styles/general.css";

const SignUpPane = ({ isOpen, onClose }) => {
  const { signup, signInWithGoogle, signInWithFacebook, signInWithApple } =
    useAuth();
  const [closing, setClosing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showLoginPane, setShowLoginPane] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleMouseDown = () => setPasswordVisible(true);
  const handleMouseUp = () => setPasswordVisible(false);


  useEffect(() => {
    if (!isOpen) setClosing(false);
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 300);
  };

  const handleOpenLogin = () => {
    setShowLoginPane(!showLoginPane);
  };

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, name } = userInfo;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsVerifying(true); // Start verification process

    try {
      await signup(email, password, name);
      clearForm();
      handleClose();
    } catch (error) {
      alert("Error signing up: " + error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const clearForm = () => {
    setUserInfo({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      handleClose();
    } catch (error) {
      alert("Error signing in with Google: " + error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      handleClose();
    } catch (error) {
      alert("Error signing in with Facebook: " + error.message);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      handleClose();
    } catch (error) {
      alert("Error signing in with Apple: " + error.message);
    }
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

        <div className="flex flex-col items-center cursor-pointer">
          <h1 className="text-3xl text-center font-Pacifico text-[#E51B21]">
            Island Insight
          </h1>
          <div className="flex items-center mt-2">
            <div className="w-20 h-0.5 bg-[#E51B21]"></div>
            <div className="ml-4 font-roboto font-bold text-xs text-gray-700">
              Create account
            </div>
          </div>
          <div className="text-center">
            <h3 className="roboto-bold mt-8">Join Island Insights today!</h3>
            <p className="roboto-bold text-[12px] text-gray-600 mx-4">
              Stay informed, share your voice, and engage with your community.
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="display-block mt-8" onSubmit={handleSubmit}>
          <p className="text-xs roboto-bold mt-2 text-gray-700 ml-10">Name</p>
          <input
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            className="w-[96%] h-10 mt-2 ml-3 rounded-3xl border-none bg-[#d9d9d9] pl-4"
            required
          />

          <p className="text-xs roboto-bold mt-2 text-gray-700 ml-10">
            Email or phone number
          </p>
          <input
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            type="email"
            className="w-[96%] h-10 mt-2 ml-3 rounded-3xl border-none bg-[#d9d9d9] pl-4"
            required
          />

          <p className="text-xs mt-4 roboto-bold text-gray-700 ml-10">
            Password
          </p>
          <div className="relative w-[96%] mt-2 ml-3">
            <input
              name="password"
              value={userInfo.password}
              onChange={handleChange}
              className="w-full h-10 rounded-3xl border-none bg-[#d9d9d9] pl-4 pr-10"
              type={passwordVisible ? "text" : "password"}
              required
            />
            <img
              src={eyeIcon}
              alt="Toggle visibility"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer h-4 mr-2"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            />
          </div>

          <p className="text-xs mt-4 roboto-bold text-gray-700 ml-10">
            Confirm Password
          </p>
          <div className="relative w-[96%] mt-2 ml-3">
            <input
              name="confirmPassword"
              value={userInfo.confirmPassword}
              onChange={handleChange}
              className="w-full h-10 rounded-3xl border-none bg-[#d9d9d9] pl-4 pr-10"
              type={passwordVisible ? "text" : "password"}
              required
            />
            <img
              src={eyeIcon}
              alt="Toggle visibility"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer h-4 mr-2"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            />
          </div>

          <button
            type="submit"
            className="w-[96%] ml-3 mt-6 bg-[#E51B21] text-white roboto-bold text-xs p-2.5 rounded-3xl cursor-pointer hover:bg-[#d91c27] hover:shadow-lg transition duration-300 ease-in-out"
          >
            NEXT
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <div className="w-[28%] mt-2 h-[1.5px] bg-[#716868]"></div>
          <p className="roboto-bold text-xs text-gray-700 mx-3">
            Or continue with
          </p>
          <div className="w-[28%] mt-2 h-[1.5px] bg-[#716868]"></div>
        </div>

        <div className="flex justify-around mt-6 mx-8">
          <button
            className="bg-[#d9d9d9] rounded-full p-2 hover:bg-[#d0d0d0] transition duration-300 ease-in-out"
            onClick={handleFacebookSignIn}
          >
            <img src={facebookLogo} alt="Facebook" className="h-6 w-6" />
          </button>
          <button
            className="bg-[#d9d9d9] rounded-full p-2 hover:bg-[#d0d0d0] transition duration-300 ease-in-out"
            onClick={handleGoogleSignIn}
          >
            <img src={googleLogo} alt="Google" className="h-6 w-6" />
          </button>
          <button
            className="bg-[#d9d9d9] rounded-full p-2 hover:bg-[#d0d0d0] transition duration-300 ease-in-out"
            onClick={handleAppleSignIn}
          >
            <img src={appleLogo} alt="Apple" className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPane;
