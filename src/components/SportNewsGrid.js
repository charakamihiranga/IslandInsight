import React, { useEffect, useState } from "react";
import NewsPopup from "./NewsPopup";
import "./../assets/styles/general.css";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function SportNewsGrid() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isNewsPopupOpen, setIsNewsPopupOpen] = useState(false);
  const { currentUser } = useAuth();

  const newsapi = process.env.REACT_APP_NEWS_API_KEY;

  useEffect(() => {
    const fetchSportNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=sports&apiKey=${newsapi}`
        );
        const data = await response.json();

        if (data.status === "ok" && data.articles.length) {
          // Filter out articles with 'removed' in the title
          const filteredArticles = data.articles.filter(
            (article) => !article.title.toLowerCase().includes("removed")
          );
          setNews(filteredArticles);
        } else {
          console.error("No articles found");
        }
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching sports news:", error);
        setLoading(false);
      }
    };

    fetchSportNews();
  }, [newsapi]); // Added newsapi as a dependency for better practice

  const getPublishedTime = (dateTime) => {
    const publishedDateTime = new Date(dateTime);
    const now = new Date();

    const diffMs = now - publishedDateTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
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

  const handleCardClick = (news) => {
    window.open(news.url, "_blank"); // Open the news article in a new tab
  };

  const handleClosePopup = () => {
    setIsNewsPopupOpen(false);
    setSelectedNews(null);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-[195px] py-5">
      <h2 className="text-xl md:text-xl lg:text-2xl roboto-bold mb-6">
        Latest Sports News
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
                key={item.url} // Ensure this key is unique for each article
                className="news-card shadow-lg rounded-lg overflow-hidden transition duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() =>
                  handleCardClick({
                    title: item.title,
                    url: item.url,
                    publishedDate: item.publishedAt,
                    readTime: getReadTime(item.content || ""),
                    imgLink: item.urlToImage,
                    agencyLogo: item.source.name,
                    postContent: item.content,
                    publishedTime: getPublishedTime(item.publishedAt),
                  })
                }
              >
                <img
                  src={item.urlToImage}
                  alt="Latest Sports News"
                  className="w-full h-[40vh] md:h-[30vh] object-cover rounded-t-lg"
                  loading="lazy"
                />
                <div className="w-full p-4 flex flex-col justify-between">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center space-x-2 mb-2">
                      <p className="text-xs text-black roboto-regular">
                        {getPublishedTime(item.publishedAt)}
                      </p>
                    </div>
                    <h1 className="abhaya-libre-bold text-base sm:text-lg md:text-xl lg:text-xl mb-6">
                      {item.title}
                    </h1>
                  </div>
                  <div className="flex flex-row items-center space-x-1 text-xs">
                    <p className="text-[#E51B21] roboto-bold">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500">|</p>
                    <p className="text-[#363434] roboto-bold">
                      {getReadTime(item.content || "")} min read
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

export default SportNewsGrid;
