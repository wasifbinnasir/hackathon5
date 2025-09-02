'use client';
import { useMyCarsQuery } from '@/lib/apis';
import { useTopBidsQuery } from '@/lib/apis';

function CarCard({ car }: { car: any }) {
  // fetch top bid for the auction linked to this car
  const { data: bids } = useTopBidsQuery(
    { auctionId: car?.auction?._id, limit: 1 },
    { skip: !car?.auction?._id } // skip if no auction
  );

  const currentBid = bids?.[0]?.amount ?? null;

  return (
    <div className="bg-white rounded shadow p-3">
      <img
        src={car.images?.[0] || 'https://picsum.photos/400/240'}
        className="w-full h-40 object-cover rounded"
      />
      <div className="mt-2 font-semibold">
        {car.title || `${car.make} ${car.model}`}
      </div>
      <div className="text-sm text-gray-600">
        {car.year} • Asking: ${car.price}
      </div>
      <div className="text-sm text-blue-600">
        Current Bid: {currentBid ? `$${currentBid}` : 'No bids yet'}
      </div>
    </div>
  );
}

export default function MyCars() {
  const { data } = useMyCarsQuery();

  return (
    <div className="py-8">
      <div className="text-xl font-semibold mb-4">My Cars</div>
      <div className="grid md:grid-cols-3 gap-4">
        {(data || []).map((c: any) => (
          <CarCard key={c._id} car={c} />
        ))}
      </div>
    </div>
  );
}
