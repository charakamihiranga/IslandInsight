import React, { useEffect, useState } from "react";
import {
  ref,
  onValue,
  query,
  limitToLast,
  orderByKey,
} from "firebase/database";
import { db } from "../configs/firebaseConfig";
import "./../styles/general.css";

function LatestNewsCard() {
  const [latestNews, setLatestNews] = useState(null);

  useEffect(() => {
    // Create a reference to the 'news' node in the Firebase Realtime Database
    const newsRef = ref(db, "news");
    // Create a query to get the last news item
    const latestNewsQuery = query(newsRef, orderByKey(), limitToLast(1));
    // Listen to data changes in the Realtime Database
    onValue(
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
      {
        onlyOnce: true, // Fetch data only once
      }
    );
  }, []);

  // Function to calculate the time difference and return a published time
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

  return (
    <div className="container bg-[#d9d9d9] w-[75vw] h-[36vh] mx-auto rounded-xl flex flex-row items-center justify-start p-0 my-10">
      {latestNews ? (
        <>
          {/* News Image */}
          <img
            src={latestNews.imgLink}
            alt="Latest News"
            className="w-[30vw] h-full object-cover rounded-lg"
          />

          {/* News Details */}
          <div className="w-[45vw] h-full relative">
            <div className="flex flex-row items-center space-x-1 absolute top-5 left-8">
              <img
                src={latestNews.agencyLogo}
                alt="Agency Logo"
                className="h-3 object-cover"
              />
              <p className="text-xs roboto-regular mb-0.5">
                {getPublishedTime(latestNews.date)}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="loader-icon"></div>
        </div>
      )}
    </div>
  );
}

export default LatestNewsCard;
