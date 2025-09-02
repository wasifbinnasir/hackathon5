'use client';
import { useMyBidsQuery } from '@/lib/apis';
import Link from 'next/link';

export default function MyBids() {
  const { data } = useMyBidsQuery();

  return (
    <div className="py-8">
      <div className="text-xl font-semibold mb-4">My Bids</div>
      <div className="grid md:grid-cols-3 gap-4">
        {(data || []).map((b:any)=>(
          <div key={b._id} className="bg-white rounded shadow p-3 flex flex-col">
            <img src={b.auction?.car?.images?.[0] || 'https://picsum.photos/400/240'} className="w-full h-40 object-cover rounded"/>
            <div className="mt-2 font-semibold">{b.auction?.car?.title || `${b.auction?.car?.make} ${b.auction?.car?.model}`}</div>
            <div className="text-sm text-gray-600">Your Bid: ${b.amount}</div>
            <div className="text-sm text-gray-600">Current: ${b.auction?.currentPrice}</div>
            <Link className="mt-3 bg-indigo-600 text-white text-center rounded py-2" href={`/auctions/${b.auction?._id}`}>Submit a Bid</Link>
          </div>
        ))}
      </div>
    </div>
  );
}