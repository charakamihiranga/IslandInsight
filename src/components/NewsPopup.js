import React, { useState, useEffect } from "react";
import "./../assets/styles/general.css";
import closeIcon from "./../assets/Close.png";
import clockIcon from "./../assets/clockIcon.png";
import commentsIcon from "./../assets/comments.png";
import likeIcon from "./../assets/likeIcon.png";
import shareIcon from "./../assets/shareIcon.png";
import likedIcon from "./../assets/likedIcon.png";
import sendIcon from "./../assets/send.png";
import commentHeaderIcon from "./../assets/userComments.png";
import dProfile from "./../assets/profile.png";
import LoginPane from "./LoginPane";
import {
  updateLikesInDb,
  postCommentToDb,
  checkIfLiked, // Import the function to check if the user liked
  listenToLikes,
  listenToComments,
} from "../configs/firestoreOperations";

const NewsPopup = ({ isOpen, onClose, news, user }) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [loginPaneOpen, setLoginPaneOpen] = useState(false);

  const openLoginPane = () => setLoginPaneOpen(true);
  const closeLoginPane = () => setLoginPaneOpen(false);

  // Handle share button clicked
  const handleShareClick = async () => {
    const shareMessage = `📢 ${news.title}\n\n${news.postContent}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: news.title,
          text: shareMessage,
        });
      } else {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(
          shareMessage
        )}`;
        window.open(shareUrl, "_blank");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Function to get the time difference from the current time
  const getTimeDifference = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return "unknown";
    }

    const now = new Date();
    const commentTime = new Date(timestamp.seconds * 1000);
    const diffInSeconds = Math.floor((now - commentTime) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    }
  };

  // Handle opening delay
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 100);
      checkUserLiked(); // Check if the user liked the news when opening
      listenToLikesCount();
      listenToCommentsSection();
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Listen to real-time updates to the comments
  const listenToCommentsSection = () => {
    const unsubscribe = listenToComments(news.newsid, (updatedComments) => {
      setComments(updatedComments);
      setCommentCount(updatedComments.length);
    });
    return () => unsubscribe();
  };

  // Listen for real-time updates to the like count
  const listenToLikesCount = () => {
    const unsubscribe = listenToLikes(news.newsid, (updatedLikeCount) => {
      setLikeCount(updatedLikeCount); // Update the like count when it changes
    });
    return () => unsubscribe();
  };

  // Function to check if the current user liked the news article
  const checkUserLiked = async () => {
    if (!user || !user.uid) {
      setLiked(false);
      return;
    }
    const isLiked = await checkIfLiked(news.newsid, user.uid); // Assuming this function returns true/false
    setLiked(isLiked);
  };

  // Handle close with animation
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 300);
  };

  // Handle like button clicked
  const handleLikeClick = async () => {
    if (!user || !user.uid) {
      openLoginPane();
      return;
    }
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
    setLikeAnimation(true);
    await updateLikesInDb(news.newsid, newLikedStatus, user.uid);
    setTimeout(() => {
      setLikeAnimation(false);
    }, 500);
  };

  // Handle post comment
  const handlePostComment = async () => {
    if (!user) {
      openLoginPane();
      return;
    }
    if (comment.trim()) {
      await postCommentToDb(news.newsid, {
        userId: user.uid,
        username: user.displayName || "User",
        comment,
        userPhoto: user.photoURL,
      });
      setComment("");
    } else {
      alert("Please write a comment before sending.");
    }
  };

  const getFomattedPublishedTime = (time) => {
    // Split the time string into the number and the unit
    const [value, unit] = time.split(" ");

    // Convert the full word ("hours" or "minutes") to its shortened form ("h" or "m")
    if (unit.startsWith("hour")) return `${value}h`;
    if (unit.startsWith("minute")) return `${value}m`;

    return time; // If it's "Just now", return as is
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
        className={`bg-white p-4 sm:p-8 rounded-t-2xl w-full sm:w-[80vw] md:w-[60vw] lg:w-[48vw] h-[90vh] shadow-lg relative transition-transform transform duration-300 ease-in-out delay-100 ${
          visible && !closing ? "scale-100" : "scale-90"
        }`}
      >
        <button
          className="absolute top-4 right-6 w-6 h-6 z-10 text-gray-500 hover:text-gray-800 transition-transform transform hover:scale-110"
          onClick={handleClose}
        >
          <img src={closeIcon} alt="Close" className="w-6 h-6" />
        </button>

        <div className="absolute inset-0 top-12 px-[3vw] mb-[10vh] bg-white rounded-lg overflow-y-auto overflow-x-hidden">
          <div className="p-4">
            <img src={news.imgLink} className="w-full rounded-lg" alt="News" />
            <h1 className="abhaya-libre-bold text-base sm:text-lg md:text-xl lg:text-2xl text-center pt-4">
              {news.title}
            </h1>
          </div>

          <div className="flex justify-between space-x-4 items-center mr-5 pb-2 news-metadata">
            <div className="flex items-center space-x-1 ml-auto mr-3 pl-4">
              <img src={likedIcon} className="likeCount w-6" alt="liked Icon" />
              <p className="roboto-bold text-[#363434] text-xs sm:text-sm md:text-sm">
                {likeCount}
              </p>
            </div>

            <div className="flex-grow" />
            <div className="flex items-center space-x-1 ml-auto mr-3">
              <img src={clockIcon} className="clockIcon w-6" alt="Clock Icon" />
              <p className="roboto-bold text-[#363434] text-xs sm:text-sm md:text-sm">
                {getFomattedPublishedTime(news?.publishedTime)}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <img
                src={commentsIcon}
                className="cmtsIcon w-6"
                alt="Comments Icon"
              />
              <p className="roboto-bold text-[#E51B21] text-xs sm:text-sm md:text-sm">
                {commentCount}
              </p>
            </div>
          </div>

          <hr className="grayLine" />

          <div>
            <p className="abhaya-libre-regular text-xs sm:text-sm md:text-base lg:text-lg p-4 pt-6 text-justify pb-8">
              {news.postContent}
            </p>
          </div>

          <div className="flex justify-between items-center px-4 mb-0 sm:mb-0 md:mb-2">
            <img
              className="popupAgencyLogo h-4 object-cover"
              src={news?.agencyLogo || "https://esana.com.lk/assets/img/esena-logo.webp"}
              alt="Agency Logo"
            />
            <div className="flex justify-end items-center space-x-2">
              <p className="text-[#E51B21] roboto-bold text-sm sm:text-xs md:text-sm">
                {news?.publishedDate
                  ? new Date(news.publishedDate.replace(/\//g, "-"))
                      .toISOString()
                      .slice(0, 10)
                      .replace(/-/g, "/")
                  : ""}
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
              className={`flex items-center justify-center w-full sm:w-1/2 px-3 py-2 transition-transform transform hover:scale-105 hover:bg-gray-200 hover:shadow-lg rounded-full ${
                likeAnimation ? "animate-like" : ""
              }`}
              onClick={handleLikeClick}
            >
              <img
                className="reaction h-7 pr-1"
                alt="Like"
                src={liked ? likedIcon : likeIcon} // Use liked state to determine icon
              />
              <p className="sm:block text-xs sm:text-sm">Like</p>
            </button>
            <button
              className="flex items-center justify-center w-full sm:w-1/2 px-3 py-2 transition-transform transform hover:scale-105 hover:bg-gray-200 hover:shadow-lg rounded-full"
              onClick={handleShareClick}
            >
              <img className="reaction h-7 pr-1" alt="Share" src={shareIcon} />
              <p className="sm:block text-xs sm:text-sm">Share</p>
            </button>
          </div>

          <div className="flex items-center mt-6 space-x-2 px-2">
            <img
              className="commentSectionIcon h-9 "
              alt="Comment Section"
              src={commentHeaderIcon}
            />
            <h2 className="roboto-bold text-base sm:text-sm md:text-sm lg:text-lg">
              Your Thoughts!
            </h2>
          </div>

          <div className="commentSection w-full bg-white rounded-xl mt-4 p-2">
            {comments.length === 0 ? (
              <div className="w-full bg-[#d9d9d9] rounded-xl mt-2 p-4">
                <p className="roboto-medium text-gray-600 text-sm">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment, index) => {
                  const firstName = comment.username
                    ? comment.username.split(" ")[0]
                    : "User";
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-2 w-full"
                    >
                      <img
                        className="commentUserPhoto w-8 h-8 rounded-full object-cover"
                        src={comment.userId ? comment.userPhoto : dProfile}
                        alt="User"
                      />
                      <div className="bg-gray-200 py-2 pb-4 px-4 sm:px-6 sm:py-3 rounded-xl w-full">
                        <div className="flex justify-between items-start mb-1 w-full">
                          <div className="flex flex-col">
                            <p className="roboto-bold text-xs sm:text-sm text-gray-700 leading-tight sm:mb-1">
                              <span className="block sm:hidden">
                                {firstName}
                              </span>
                              <span className="hidden sm:block">
                                {comment.username || "User"}
                              </span>
                            </p>
                            <p className="roboto-medium text-sm sm:text-base text-gray-800 break-words leading-tight mt-1">
                              {comment.comment}
                            </p>
                          </div>
                          <p className="roboto-medium text-xs text-gray-500 whitespace-nowrap ml-4">
                            {getTimeDifference(comment.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#E51B21] rounded-t-2xl w-full h-[9vh] absolute bottom-0 right-0 flex items-center justify-between px-6">
          <img
            className="userPhoto h-8 w-8 rounded-full mr-4"
            alt="user"
            src={user?.uid ? user.photoURL : dProfile}
          />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)} // Update state on input change
            className="commentInput flex-grow h-8 rounded-full bg-white pl-5 mr-4 roboto-regular text-sm focus:outline-none"
            placeholder="Write your thoughts..."
          />
          <button onClick={handlePostComment}>
            <img
              className="sendIcon h-8 w-8 transition-transform duration-200 transform hover:scale-110"
              alt="send"
              src={sendIcon}
            />
          </button>
        </div>
      </div>
      <LoginPane isOpen={loginPaneOpen} onClose={closeLoginPane} />
    </div>
  );
};

export default NewsPopup;
