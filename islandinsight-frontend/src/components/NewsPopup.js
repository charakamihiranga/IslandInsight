import React, { useState, useEffect } from "react";
import "./../assets/styles/general.css";
import closeIcon from "./../assets/Close.png";
import clockIcon from "./../assets/clockIcon.png";
import commentsIcon from "./../assets/comments.png";

const NewsPopup = ({ isOpen, onClose, news, user }) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Handle opening delay
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 100);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Handle close with animation
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 300);
  };

  if (!isOpen && !closing) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
        visible && !closing
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white p-4 sm:p-8 rounded-2xl w-full sm:w-[80vw] md:w-[60vw] lg:w-[48vw] h-[90vh] shadow-lg relative transition-transform transform duration-300 ease-in-out delay-100 ${
          visible && !closing ? "scale-100" : "scale-90"
        }`}
      >
        <button
          className="absolute top-4 right-6 w-6 h-6 z-10 text-gray-500 hover:text-gray-800 transition-transform transform hover:scale-110"
          onClick={handleClose}
        >
          <img src={closeIcon} alt="Close" className="w-6 h-6" />
        </button>

        <div className="absolute inset-0 top-12 px-[3vw] bg-[#d9d9d9] rounded-lg overflow-y-auto">
          <div className="p-4">
            <img src={news.imgLink} className="w-full rounded-lg" alt="News" />
            <h1 className="abhaya-libre-bold text-base sm:text-lg md:text-xl lg:text-2xl text-center pt-3">
              {news.title}
            </h1>
          </div>
          <div className="flex space-x-5 items-center mr-5 pb-2">
            <div className="flex items-center space-x-1 ml-auto">
              <img
                src={clockIcon}
                className="w-6"
                alt="Clock Icon"
              />
              <p className="roboto-bold text-[#363434] text-xs sm:text-sm md:text-sm">
                27m
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <img
                src={commentsIcon}
                className="w-6"
                alt="Comments Icon"
              />
              <p className="roboto-bold text-[#E51B21] text-xs sm:text-sm md:text-sm">
                54
              </p>
            </div>
          </div>
          <div className="w-full h-[1px] sm:h-[1.5px] md:h-[1.5px] bg-[#716868]" />
        </div>
      </div>
    </div>
  );
};

export default NewsPopup;
