"use client";

import {
  useLiveAuctionsQuery,
  useListCarsQuery,
  useAddWishlistMutation,
  useRemoveWishlistMutation,
  useMyWishlistQuery,
} from "@/lib/apis";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import AuctionCard from "../components/AuctionCard";

export default function Home() {
  const [q, setQ] = useState({
    make: "",
    year: "",
    maxPrice: "",
    search: "",
  });

  const { data: live } = useLiveAuctionsQuery();
  const { data: cars } = useListCarsQuery({});
  const makes = [...new Set(cars?.items?.map((c: any) => c.make) || [])];

  const { data: wishlist, refetch } = useMyWishlistQuery();
  const [addWishlist] = useAddWishlistMutation();
  const [removeWishlist] = useRemoveWishlistMutation();
  const [isWishlistLoading, setIsWishlistLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleWishlist = async (carId: string) => {
    if (isWishlistLoading[carId]) return;

    try {
      setIsWishlistLoading((prev) => ({ ...prev, [carId]: true }));
      const isWishlisted = wishlist?.some((w) => w._id === carId);
      if (isWishlisted) {
        await removeWishlist(carId).unwrap();
      } else {
        await addWishlist({ carId }).unwrap();
      }
    } catch (error: any) {
      if (error.status === 409) {
        console.log("Car is already in wishlist");
        await refetch();
      } else {
        console.error("Wishlist operation failed:", error);
      }
    } finally {
      setIsWishlistLoading((prev) => ({ ...prev, [carId]: false }));
    }
  };

  // Improved filtering logic
  const filteredAuctions = live?.filter((a: any) => {
    const car = a.car;
    if (!car) return false;

    // Filter by make
    if (q.make && car.make.toLowerCase() !== q.make.toLowerCase()) return false;

    // Filter by year
    const carYear = car.year ? new Date(car.year).getFullYear() : null;
    if (q.year && carYear !== +q.year) return false;

    // Filter by max price
    if (q.maxPrice && a.currentPrice > Number(q.maxPrice)) return false;

    // Filter by search keyword
    const searchText = `${car.make} ${car.model || car.carModel || ""} ${
      car.title || ""
    }`.toLowerCase();
    if (q.search && !searchText.includes(q.search.toLowerCase())) return false;

    return true;
  });

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[500px] flex items-center justify-center"
        style={{ backgroundImage: "url('/Hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white max-w-3xl px-6">
          <p className="uppercase tracking-widest text-sm mb-2 text-primary bg-[#BBD0F6] w-[210px] h-11 flex justify-center items-center rounded-md">
            Welcome to Auction
          </p>
          <h1 className="text-7xl mb-4 font-family-josefin">
            Find Your Dream Car
          </h1>
          <p className="mb-6 text-gray-200">
            Browse through thousands of cars and find the one that’s perfect for
            you.
          </p>

          {/* Filters + Search Bar */}
          <div className="bg-white rounded-md shadow-md p-3 flex flex-wrap md:flex-nowrap gap-3">
            {/* Make Dropdown */}
            <select
              className="flex-1 min-w-[120px] rounded border px-3 py-2 text-gray-900"
              value={q.make}
              onChange={(e) => setQ({ ...q, make: e.target.value })}
            >
              <option value="">Select Make</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              className="flex-1 min-w-[120px] rounded border px-3 py-2 text-gray-900"
              value={q.year}
              onChange={(e) => setQ({ ...q, year: e.target.value })}
            >
              <option value="">Select Year</option>
              {Array.from(
                { length: 30 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Max Price */}
            <input
              className="flex-1 min-w-[120px] rounded border px-3 py-2 text-gray-900"
              placeholder="Max Price"
              value={q.maxPrice}
              onChange={(e) => setQ({ ...q, maxPrice: e.target.value })}
            />

            {/* Search Bar */}
            <div className="relative flex-[2] min-w-[200px] rounded border bg-primary">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg mt-2" />
              <input
                type="text"
                placeholder="Search"
                value={q.search}
                onChange={(e) => setQ({ ...q, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded border-none focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Auctions */}
      <section className="bg-primary text-white py-12 mt-12">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold ">Live Auction</h2>
          <div className="flex justify-center items-center mt-2">
            <div className="w-16 h-0.5 bg-white"></div>
            <div className="w-4 h-4 bg-yellow-400 rotate-45"></div>
            <div className="w-16 h-0.5 bg-white"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-6">
          {filteredAuctions && filteredAuctions.length > 0 ? (
            filteredAuctions.map((a: any) => {
              const isWishlisted = wishlist?.some((w) => w._id === a.car?._id);
              return (
                <AuctionCard
                  key={a._id}
                  auction={a}
                  isWishlisted={isWishlisted}
                  toggleWishlist={toggleWishlist}
                  isLoading={isWishlistLoading[a.car._id]}
                />
              );
            })
          ) : (
            <p className="col-span-4 text-center text-gray-200">No car found</p>
          )}
        </div>
      </section>
    </div>
  );
}
