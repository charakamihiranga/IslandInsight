import React, { useEffect, useState } from "react";
import { ref, onValue, query, orderByKey } from "firebase/database";
import { db } from "../configs/firebaseConfig";
import "./../assets/styles/general.css";
import { useAuth } from "../context/AuthContext";
import NewsPopup from "./NewsPopup";

function NewsGrid() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null); // State to pass the selected news to the popup
  const [isNewsPopupOpen, setIsNewsPopupOpen] = useState(false); // State to manage the visibility of the news popup

  const { currentUser } = useAuth(); // Get the current user from the AuthContext

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

  const getPublishedTime = (scrapedDate, time) => {
    const publishedDateTime = new Date(scrapedDate);
    const now = new Date();
    const diffMs = now - publishedDateTime;
    const totalDiffMins = Math.floor(diffMs / (1000 * 60));
    const normalizedTime = time.trim().toLowerCase();
    let additionalMins = 0;

    const extractTimeValue = (regex) => {
      const match = normalizedTime.match(regex);
      return match ? parseInt(match[1], 10) : 0;
    };

    if (normalizedTime === "yesterday") {
      additionalMins = 24 * 60;
    } else {
      additionalMins += extractTimeValue(/(\d+)\s+day[s]?/) * 24 * 60;
      additionalMins += extractTimeValue(/(\d+)\s+hour[s]?/) * 60;
      additionalMins += extractTimeValue(/(\d+)\s+minute[s]?/);
    }

    const finalMins = totalDiffMins + additionalMins;

    if (finalMins < 1) return "Just now";
    if (finalMins < 60)
      return `${finalMins} minute${finalMins > 1 ? "s" : ""} ago`;

    const finalHours = Math.floor(finalMins / 60);
    if (finalHours < 24)
      return `${finalHours} hour${finalHours > 1 ? "s" : ""} ago`;

    const finalDays = Math.floor(finalHours / 24);
    return `${finalDays} day${finalDays > 1 ? "s" : ""} ago`;
  };

  const getReadTime = (content) => {
    if (!content) return 0;
    const words = content.split(" ");
    return Math.ceil(words.length / 200);
  };

  const handleCardClick = (news) => {
    setSelectedNews(news);
    setIsNewsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsNewsPopupOpen(false);
    setSelectedNews(null);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-[195px] py-5">
      <h2 className="text-xl md:text-xl lg:text-2xl roboto-bold mb-6">
        Latest News
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? // Render skeleton cards while loading
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
          : // Render news cards once data is loaded
            news.map((item) => (
              <div
                key={item.newsid}
                className="news-card shadow-lg rounded-lg overflow-hidden transition duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() =>
                  handleCardClick({
                    newsid: item.newsid,
                    title: item.title,
                    publishedDate: item.date.replace(/-/g, "/").split(" ")[0],
                    readTime: getReadTime(item.postContent),
                    imgLink: item.imgLink,
                    agencyLogo: item.agencyLogo,
                    postContent: item.postContent,
                    publishedTime: getPublishedTime(item.date, item.time),
                  })
                }
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
                        src={
                          item.agencyLogo ||
                          "https://esana.com.lk/assets/img/esena-logo.webp"
                        }
                        alt="Agency Logo"
                        className="h-4 agency-logo object-cover"
                      />
                      <p className="text-xs text-black roboto-regular">
                        {getPublishedTime(item.date, item.time)}
                      </p>
                    </div>

                    <h1 className="abhaya-libre-bold text-base sm:text-lg md:text-xl lg:text-xl mb-6">
                      {item.title}
                    </h1>
                  </div>
                  <div className="flex flex-row items-center space-x-1 text-xs">
                    <p className="text-[#E51B21] roboto-bold">
                      {new Date(item.date)
                        .toISOString()
                        .slice(0, 10)
                        .replace(/-/g, "/")}
                    </p>
                    <p className="text-gray-500">|</p>
                    <p className="text-[#363434] roboto-bold">
                      {getReadTime(item.postContent)} min read
                    </p>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {isNewsPopupOpen && selectedNews && (
        <NewsPopup
          isOpen={isNewsPopupOpen}
          onClose={handleClosePopup}
          news={selectedNews}
          user={currentUser}
        />
      )}
    </section>
  );
}

export default NewsGrid;
