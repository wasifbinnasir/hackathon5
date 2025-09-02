"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

/* Types */
export type Auction = {
  _id: string;
  car: Car;
  currentPrice: number;
  endTime: string;
  status: "scheduled" | "live" | "ended";
  startTime: string;
  isTrending?: boolean;
};

export type Car = {
  _id: string;
  title?: string;
  make: string;
  carModel: string;
  year: number | string;
  images?: string[];
};

type AuctionCardProps = {
  auction: Auction;
  isWishlisted: boolean;
  toggleWishlist: (carId: string) => void;
  isLoading: boolean;
};

/* Helper for countdown */
function getTimeLeft(endDate: string) {
  const total = new Date(endDate).getTime() - new Date().getTime();
  if (total <= 0) return null;
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  isWishlisted,
  toggleWishlist,
  isLoading,
}) => {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(
    getTimeLeft(auction.endTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(auction.endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [auction.endTime]);

  if (!timeLeft) return null;

  return (
    <div className="bg-white max-w-[280px] rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 px-4 py-2">
        {auction?.isTrending && (
          <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Trending
          </div>
        )}
        <h3 className="text-sm font-semibold text-gray-800 truncate flex-1 px-2">
          {auction?.car?.title || `${auction?.car?.make} ${auction?.car?.carModel}`}
        </h3>
        <button
          className="text-lg"
          onClick={() => toggleWishlist(auction.car._id)}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-spin">⌛</span>
          ) : isWishlisted ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full h-40 mt-2">
        <img
          src={auction.car?.images?.[0]}
          alt={auction.car?.title || "Car"}
          
          className="object-contain px-4"
        />
      </div>

      {/* Bid & Timer Info */}
      <div className="grid grid-cols-2 text-center py-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            ${auction?.currentPrice?.toLocaleString() || "0.00"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Current Bid</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </p>
          <p className="text-xs text-gray-500 mt-1">Time Left</p>
        </div>
      </div>

      {/* Submit Bid */}
      <div className="px-5 pb-3">
        <Link href={`/auctions/${auction._id}`}>
          <button className="w-full bg-blue-900 text-white text-sm font-semibold py-2 rounded-md hover:bg-blue-800 transition">
            Submit A Bid
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AuctionCard;
