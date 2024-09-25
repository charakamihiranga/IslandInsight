import React, { useEffect, useState } from "react";
import { ref, onValue, query, orderByKey } from "firebase/database";
import { db } from "../configs/firebaseConfig";
import './../assets/styles/general.css';

function NewsGrid() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newsRef = query(ref(db, "news"), orderByKey());

    onValue(newsRef, (snapshot) => {
      const newsData = [];
      snapshot.forEach((childSnapshot) => {
        const newsItem = childSnapshot.val();
        newsItem.newsid = childSnapshot.key; 
        newsData.push(newsItem);
      });

      // Sort news by descending newsid and remove the latest one
      newsData.sort((a, b) => b.newsid - a.newsid);
      newsData.shift(); // Remove the latest news (highest newsid)
      setNews(newsData);
      setLoading(false); // Set loading to false when data is loaded
    });
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

  const handleCardClick = (newsid) => {
    alert(`News ID: ${newsid}`);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-[195px] py-5">
      <h2 className="text-xl md:text-xl lg:text-2xl roboto-bold mb-6">
        Latest News
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Render skeleton cards while loading
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="skeleton-card shadow-lg rounded-lg overflow-hidden"
            >
              <div className="skeleton-img"></div>
              <div className="w-full p-4 flex flex-col justify-between">
                <div className="flex flex-col">
                  <div className="skeleton-text mb-4"></div>
                  <div className="skeleton-text mb-4"></div>
                </div>
                <div className="flex flex-row items-center space-x-1 text-xs">
                  <div className="skeleton-text w-16"></div>
                  <div className="skeleton-text w-12"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Render news cards once data is loaded
          news.map((item) => (
            <div
              key={item.newsid}
              className="news-card shadow-lg rounded-lg overflow-hidden transition duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(item.newsid)}
            >
              <img
                src={item.imgLink}
                alt="Latest News"
                className="w-full h-[40vh] md:h-[30vh] object-cover rounded-t-lg"
                loading="lazy"
              />
              <div className="w-full p-4 flex flex-col justify-between">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center space-x-2 mb-2">
                    <img
                      src={item.agencyLogo}
                      alt="Agency Logo"
                      className="h-4 agency-logo object-cover"
                    />
                    <p className="text-xs text-black roboto-regular">
                      {getPublishedTime(item.date)}
                    </p>
                  </div>

                  <h1 className="abhaya-libre-bold text-base sm:text-lg md:text-xl lg:text-xl mb-6">
                    {item.title}
                  </h1>
                </div>
                <div className="flex flex-row items-center space-x-1 text-xs">
                  <p className="text-[#E51B21] roboto-bold">
                    {item.date.replace(/-/g, "/").split(" ")[0]}
                  </p>
                  <p className="text-gray-500">|</p>
                  <p className="text-[#363434] roboto-bold">
                    {getReadTime(item.postContent)} min read
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default NewsGrid;
