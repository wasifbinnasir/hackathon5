"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  useGetAuctionQuery,
  useTopBidsQuery,
  usePlaceBidMutation,
} from "@/lib/apis";
import { Bid } from "@/types/auction";
import PageHeader from "../../components/PageHeader";

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token, user } = useSelector((state: RootState) => state.auth);

  const {
    data: auction,
    isLoading: auctionLoading,
    error: auctionError,
    refetch,
  } = useGetAuctionQuery(id);

  const {
    data: topBids = [],
    isLoading: bidsLoading,
    error: bidsError,
  } = useTopBidsQuery({ auctionId: id, limit: 10 });

  const [placeBid, { isLoading: placingBid }] = usePlaceBidMutation();
  const [amount, setAmount] = useState<number>(0);
  const [bidError, setBidError] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);

  // Track user’s last bid
  const [myLastBid, setMyLastBid] = useState<Bid | null>(null);

  // Get top bid
  const topBid: Bid | null = topBids.length > 0 ? (topBids[0] as Bid) : null;

  // Initialize bid amount when auction loads or topBid changes
  useEffect(() => {
    if (topBid?.amount) {
      setAmount(topBid.amount + 100);
    } else if (auction?.currentPrice) {
      setAmount(auction.currentPrice + 100);
    }
  }, [auction?.currentPrice, topBid?.amount]);

  const handleBidSubmit = async () => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      setBidError("");

      if (!amount || amount <= (auction?.currentPrice || 0)) {
        setBidError("Bid must be higher than current price");
        return;
      }

      const newBid = await placeBid({ auctionId: id, amount }).unwrap();
      await refetch();

      // Save my last bid
      setMyLastBid(newBid);

      // Reset input for next bid
      setAmount((topBid?.amount || auction?.currentPrice || 0) + 100);
    } catch (err: any) {
      setBidError(err?.data?.message || "Failed to place bid");
    }
  };

  const renderTopBidder = () => {
    if (bidsLoading) return <p className="text-gray-600">Loading bids...</p>;
    if (bidsError) return <p className="text-red-600">Error loading bids</p>;
    if (!topBids || topBids.length === 0)
      return <p className="text-gray-600">No bids placed yet.</p>;

    return (
      <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-xl font-semibold">
            {topBid?.bidder?.name?.charAt(0) || "A"}
          </span>
        </div>
        <div>
          <div className="text-lg font-semibold">
            {topBid?.bidder?.name || "Anonymous Bidder"}
          </div>
          <div className="text-gray-600">
            Bid Amount: ${topBid?.amount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Placed: {new Date(topBid?.createdAt || "").toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  };

  if (auctionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading auction details...</div>
      </div>
    );
  }

  if (auctionError || !auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Failed to load auction details</div>
      </div>
    );
  }

  const car = auction.car;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title={car?.title || `${car?.make} ${car?.carModel}`} />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Section (images + details) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={
                      car.images?.[selectedImage] ||
                      "https://picsum.photos/800/400"
                    }
                    alt={car.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {auction.status === "ended" && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      SOLD
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {car.images && car.images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {car.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                          selectedImage === index
                            ? "border-blue-500"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {car.description || "No description available."}
                  </p>
                </div>

                {/* Car Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Car Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Make:</span> {car.make}
                    </div>
                    <div>
                      <span className="text-gray-600">Model:</span>{" "}
                      {car.carModel}
                    </div>
                    <div>
                      <span className="text-gray-600">Year:</span> {car.year}
                    </div>
                    <div>
                      <span className="text-gray-600">Body Type:</span>{" "}
                      {car.bodyType}
                    </div>
                    <div>
                      <span className="text-gray-600">Mileage:</span>{" "}
                      {car.mileage?.toLocaleString()} km
                    </div>
                    <div>
                      <span className="text-gray-600">Engine:</span>{" "}
                      {car.engine}
                    </div>
                    <div>
                      <span className="text-gray-600">Transmission:</span>{" "}
                      {car.transmission}
                    </div>
                    <div>
                      <span className="text-gray-600">Drive Type:</span>{" "}
                      {car.driveType}
                    </div>
                    <div>
                      <span className="text-gray-600">Fuel Type:</span>{" "}
                      {car.fuelType}
                    </div>
                    <div>
                      <span className="text-gray-600">Exterior Color:</span>{" "}
                      {car.exteriorColor}
                    </div>
                    <div>
                      <span className="text-gray-600">Interior Color:</span>{" "}
                      {car.interiorColor}
                    </div>
                    <div>
                      <span className="text-gray-600">Doors:</span> {car.doors}
                    </div>
                    <div>
                      <span className="text-gray-600">Seats:</span> {car.seats}
                    </div>
                    <div>
                      <span className="text-gray-600">VIN:</span> {car.vin}
                    </div>
                  </div>
                </div>

                {/* History */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">History</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Accident History:</span>{" "}
                      {car.accidentHistory || "N/A"}
                    </div>
                    <div>
                      <span className="text-gray-600">Service History:</span>{" "}
                      {car.serviceHistory || "N/A"}
                    </div>
                    <div>
                      <span className="text-gray-600">Ownership:</span>{" "}
                      {car.ownership || "N/A"}
                    </div>
                    <div>
                      <span className="text-gray-600">Import Status:</span>{" "}
                      {car.importStatus || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="lg:col-span-1 space-y-6">
                {/* Bidding Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-1">
                    Current Price
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-4">
                    ${auction.currentPrice?.toLocaleString() || "0"}
                  </div>

                  {auction.status === "live" && (
                    <div className="space-y-4">
                      {/* Input box */}
                      <input
                        type="number"
                        className={`w-full border rounded-lg px-4 py-3 text-lg font-semibold ${
                          bidError ? "border-red-500" : "border-gray-300"
                        }`}
                        value={amount}
                        onChange={(e) => {
                          setAmount(Number(e.target.value));
                          setBidError("");
                        }}
                        min={(auction.currentPrice || 0) + 1}
                        step="100"
                      />

                      {/* Range slider */}
                      <input
                        type="range"
                        className="w-full"
                        min={(auction.currentPrice || 0) + 100}
                        max={(auction.currentPrice || 0) + 5000}
                        step="100"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                      />

                      {bidError && (
                        <p className="text-sm text-red-600">{bidError}</p>
                      )}

                      <button
                        onClick={handleBidSubmit}
                        disabled={
                          placingBid ||
                          !amount ||
                          amount <= (auction.currentPrice || 0)
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
                      >
                        {!token
                          ? "Login to Bid"
                          : placingBid
                          ? "Placing..."
                          : "Submit a Bid"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Winning Bid & My Bid Section */}
                <div className="space-y-4">
                  {/* Winning Bid */}
                  {topBid && (
                    <div className="bg-green-100 border border-green-400 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800">
                        Winning Bid
                      </h3>
                      <p className="text-green-700">
                        {topBid.bidder?.name || "Anonymous"} - $
                        {topBid.amount.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* My Bid */}
                  {myLastBid && (
                    <div
                      className={`rounded-lg p-4 ${
                        myLastBid.amount === topBid?.amount
                          ? "bg-green-100 border border-green-400"
                          : "bg-red-100 border border-red-400"
                      }`}
                    >
                      <h3
                        className={`font-semibold ${
                          myLastBid.amount === topBid?.amount
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        Your Last Bid
                      </h3>
                      <p
                        className={
                          myLastBid.amount === topBid?.amount
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        ${myLastBid.amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bidders List */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Bidders List</h3>
                  {bidsLoading ? (
                    <div className="text-center py-4">Loading bids...</div>
                  ) : topBids.length > 0 ? (
                    <div className="space-y-3">
                      {topBids.map((bid: any, index: number) => (
                        <div
                          key={bid._id}
                          className="flex justify-between items-center py-2"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <span className="font-medium">
                              {bid.bidder?.name || "Anonymous"}
                            </span>
                          </div>
                          <span className="font-semibold">
                            ${bid.amount?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No bids placed yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top Bidder Section */}
          <div className="mt-8">
            <div className="bg-blue-900 text-white rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold">Top Bidder</h2>
            </div>
            {renderTopBidder()}
          </div>
        </div>
      </div>
    </div>
  );
}
