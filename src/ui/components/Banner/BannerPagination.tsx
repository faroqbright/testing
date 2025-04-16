"use client";
import React, { useEffect, useState } from "react";
import BannerCard from "./BannerCard";
import { getPostsNew } from "@/api/methods/auth";

interface BannerProps {
  onPaginate: () => void;
}

const BannerPagination: React.FC<BannerProps> = ({ onPaginate }) => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchPosts = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await getPostsNew(5); // Fetch your data
      const newPosts = response?.data?.feed?.data || [];
      setBanners(newPosts);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch data once when the component mounts
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1)); // Move back by 1
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= banners.length - 5 ? prevIndex : prevIndex + 1
    ); // Move forward by 1
  };

  const visibleBanners = banners.slice(currentIndex, currentIndex + 5);

  return (
    <div className="flex flex-col">
      <div className="overflow-hidden py-5 mx-10">
        <div className="flex gap-2">
          {Array.isArray(visibleBanners) &&
            visibleBanners.map((banner: any) => (
              <BannerCard key={banner.id} banner={banner} />
            ))}
        </div>
      </div>
      {!loading && (
        <div className="flex justify-between -mt-28 mb-24">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="bg-white p-2 rounded-full shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex + 5 >= banners.length}
            className="bg-white p-2 rounded-full shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerPagination;
