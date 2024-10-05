import React, { useState, useEffect } from "react";
import "./../assets/styles/general.css";
import closeIcon from "./../assets/Close.png";
import clockIcon from "./../assets/clockIcon.png";
import commentsIcon from "./../assets/comments.png";
import likeIcon from "./../assets/likeIcon.png";
import commentIcon from "./../assets/commentIcon.png";
import shareIcon from "./../assets/shareIcon.png";
import likedIcon from "./../assets/likedIcon.png";

const NewsPopup = ({ isOpen, onClose, news, user }) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

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

  // Handle like button clicked
  const handleLikeClick = () => {
    setLiked(!liked);
    setLikeAnimation(true);
    setTimeout(() => {
      setLikeAnimation(false); // Reset animation state after animation duration
    }, 500); // Match this duration with the CSS animation duration
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

        <div className="absolute inset-0 top-12 px-[3vw] mb-[3vh] bg-[#d9d9d9] rounded-lg overflow-y-auto">
          <div className="p-4">
            <img src={news.imgLink} className="w-full rounded-lg" alt="News" />
            <h1 className="abhaya-libre-bold text-base sm:text-lg md:text-xl lg:text-2xl text-center pt-4">
              {news.title}
            </h1>
          </div>

          <div className="flex justify-between space-x-4 items-center mr-5 pb-2 news-metadata">
            <div className="flex-grow" />
            <div className="flex items-center space-x-1 ml-auto mr-3">
              <img src={clockIcon} className="clockIcon w-6" alt="Clock Icon" />
              <p className="roboto-bold text-[#363434] text-xs sm:text-sm md:text-sm">
                27m
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <img
                src={commentsIcon}
                className="cmtsIcon w-6"
                alt="Comments Icon"
              />
              <p className="roboto-bold text-[#E51B21] text-xs sm:text-sm md:text-sm">
                54
              </p>
            </div>
          </div>

          <hr className="grayLine" />

          <div>
            <p className="abhaya-libre-regular text-xs sm:text-sm md:text-sm lg:text-base p-4 pt-6 text-justify pb-8">
              {news.postContent}
            </p>
          </div>

          <div className="flex justify-between items-center px-4 mb-0 sm:mb-0 md:mb-2">
            <img
              className="popupAgencyLogo h-4 object-cover"
              src={news?.agencyLogo}
              alt="Agency Logo"
            />
            <div className="flex justify-end items-center space-x-2">
              <p className="text-[#E51B21] roboto-bold text-sm sm:text-xs md:text-sm">
                {news?.publishedDate}
              </p>
              <p className="text-gray-500 text-sm sm:text-xs md:text-sm">|</p>
              <p className="text-[#363434] roboto-bold text-sm sm:text-xs md:text-sm">
                {news?.readTime} min read
              </p>
            </div>
          </div>

          <hr className="grayLine" />

          <div className="flex justify-between roboto-medium text-base w-full my-2">
            <button
              className={`flex items-center justify-center w-full sm:w-1/3 px-3 py-2 transition-transform transform hover:scale-105 hover:bg-gray-200 hover:shadow-lg rounded-full ${
                likeAnimation ? "animate-like" : ""
              }`}
              onClick={handleLikeClick}
            >
              <img
                className="reaction h-7 pr-1"
                alt="Like"
                src={liked ? likedIcon : likeIcon}
              />
              <p className="hidden sm:block text-xs sm:text-sm">Like</p>
            </button>
            <button className="flex items-center justify-center w-full sm:w-1/3 px-3 py-2 transition-transform transform hover:scale-105 hover:bg-gray-200 hover:shadow-lg rounded-full">
              <img
                className="reaction h-7 pr-1"
                alt="Comment"
                src={commentIcon}
              />
              <p className="hidden sm:block text-xs sm:text-sm">Comment</p>
            </button>
            <button className="flex items-center justify-center w-full sm:w-1/3 px-3 py-2 transition-transform transform hover:scale-105 hover:bg-gray-200 hover:shadow-lg rounded-full">
              <img className="reaction h-7 pr-1" alt="Share" src={shareIcon} />
              <p className="hidden sm:block text-xs sm:text-sm">Share</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPopup;
