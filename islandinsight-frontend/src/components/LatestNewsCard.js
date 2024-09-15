import React, { useEffect, useState } from "react";
import { ref, onValue, query, limitToLast, orderByKey } from "firebase/database";
import { db } from "../configs/firebaseConfig";
import "./../styles/general.css";

function LatestNewsCard() {
  const [latestNews, setLatestNews] = useState(null);

  useEffect(() => {
    const newsRef = ref(db, "news");
    const latestNewsQuery = query(newsRef, orderByKey(), limitToLast(1));

    const unsubscribe = onValue(
      latestNewsQuery,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const newsArray = Object.values(data);
          setLatestNews(newsArray[0]);
        } else {
          setLatestNews(null);
        }
      },
      (error) => {
        console.error("Error fetching latest news:", error);
      }
    );

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const getPublishedTime = (dateTime) => {
    const publishedDateTime = new Date(dateTime);
    const now = new Date();

    const diffMs = now - publishedDateTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const getReadTime = (content) => {
    if (!content) return 0;
    const words = content.split(" ");
    return Math.ceil(words.length / 200);
  };

  const handleClick = () => {
    if (latestNews) {
      alert("Redirecting to news details page");
    }
  };

  return (
    <div
      className="mx-4 sm:mx-8 md:mx-12 lg:mx-24 xl:mx-48 rounded-xl flex flex-col items-center justify-center p-4 my-10 transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      {latestNews ? (
        <div className="flex flex-col md:flex-row items-stretch w-full max-w-[1200px] mx-auto">
          <img
            src={latestNews.imgLink}
            alt="Latest News"
            className="w-full md:w-[30vw] lg:w-[40vw] xl:w-[30vw] h-[40vh] md:h-auto object-cover rounded-xl"
          />
          <div className="w-full md:w-[45vw] p-4 flex flex-col justify-between">
            <div className="flex flex-row items-center space-x-2 mb-4">
              <img
                src={latestNews.agencyLogo}
                alt="Agency Logo"
                className="h-4 object-cover"
              />
              <p className="text-xs roboto-regular">
                {getPublishedTime(latestNews.date)}
              </p>
            </div>
            <h1 className="abhaya-libre-bold text-xl mb-4">
              {latestNews.title}
            </h1>
            <p className="abhaya-libre-regular text-base text-gray-800 mb-4">
              {latestNews.postContent
                ? latestNews.postContent.split(" ").slice(0, 50).join(" ") + "..."
                : "Content not available"}
            </p>
            <div className="flex flex-row items-center space-x-1 text-xs">
              <p className="text-[#E51B21] roboto-bold">
                {latestNews.date.replace(/-/g, "/").split(" ")[0]}
              </p>
              <p className="text-gray-500">|</p>
              <p className="text-[#363434] roboto-bold">
                {getReadTime(latestNews.postContent)} min read
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="loader-icon"></div>
        </div>
      )}
    </div>
  );
}

export default LatestNewsCard;
