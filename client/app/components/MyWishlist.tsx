'use client';
import { useMyWishlistQuery, useRemoveWishlistMutation } from '@/lib/apis';
import Link from 'next/link';

export default function Wishlist() {
  const { data, refetch } = useMyWishlistQuery();
  const [remove] = useRemoveWishlistMutation();

  return (
    <div className="py-8">
      <div className="text-xl font-semibold mb-4">Wishlist ({data?.length || 0})</div>
      <div className="grid md:grid-cols-3 gap-4">
        {(data || []).map((w:any)=>(
          <div key={w._id} className="bg-white rounded shadow p-3">
            <img src={w.car?.images?.[0] || 'https://picsum.photos/400/240'} className="w-full h-40 object-cover rounded"/>
            <div className="mt-2 font-semibold">{w.car?.title || `${w.car?.make} ${w.car?.model}`}</div>
            <div className="text-sm text-gray-600">{w.car?.year} • ${w.car?.price}</div>
            <div className="flex gap-2 mt-3">
              <Link href={`/auctions/${w.car?._id}`} className="flex-1 bg-indigo-600 text-white text-center rounded py-2">Submit a Bid</Link>
              <button onClick={async()=>{ await remove(w.car?._id).unwrap(); await refetch(); }} className="px-3 py-2 border rounded">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}