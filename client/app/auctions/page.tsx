'use client';
import { useListAuctionsQuery } from '@/lib/apis';
import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import CountdownBox from '../components/CountdownBox';
import { FaStar } from 'react-icons/fa';
import moment from 'moment';

export default function AuctionsPage() {
  const [q, setQ] = useState({
    make: '',
    model: '',
    bodyType: '',
    minPrice: 0,
    maxPrice: 200000,
  });

  const { data } = useListAuctionsQuery({
    make: q.make || undefined,
    model: q.model || undefined,
    bodyType: q.bodyType || undefined,
    minPrice: q.minPrice,
    maxPrice: q.maxPrice,
    page: 1,
    limit: 10,
  });

  return (
    <>
      <PageHeader title="Auction" />
      <div className="py-8 grid md:grid-cols-4 gap-6 px-2">
        {/* Auction List */}
        <div className="md:col-span-3 space-y-4">
          <div className="text-sm text-white bg-primary py-4 rounded-lg px-2">
            Showing {data?.items?.length || 0} of {data?.total || 0} results
          </div>

          {data?.items?.map((item: any) => (
            <div
              key={item._id}
              className="w-full pr-3 h-[196px] border border-[#EAECF3] bg-white rounded-[5px] flex gap-3 overflow-hidden"
            >
              {/* Car Image */}
              <img
                src={item.car?.images?.[0] || 'https://picsum.photos/245/196'}
                alt="car_image"
                width={245}
                height={196}
                className="object-cover rounded"
              />

              {/* Details */}
              <div className="flex w-full gap-3 justify-between">
                {/* Left: Car Info */}
                <div className="py-4 flex-1">
                  <div className="flex flex-col gap-1.5">
                    <h4 className="font-bold text-xl text-[#2E3D83]">
                      {item.car?.make} {item.car?.model}
                    </h4>
                    <div className="w-[72px] h-[3px] rounded-sm bg-[#F4C23D]" />
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="h-[14px] w-[14px] text-[#F9C146]" />
                      ))}
                    </div>
                    <p className="text-sm text-[#939393]">
                      {item.car?.noteworthy_features?.slice(0, 20)}{' '}
                      <Link href="#" className="text-[12px] font-semibold text-[#2E3D83]">
                        View Details
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Right: Auction Info */}
                <div className="py-4 flex flex-col justify-between">
                  <div className="flex justify-between">
                    {/* Current Bid + Countdown */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <h5 className="font-bold text-sm text-[#2E3D83]">
                          ${item.currentPrice}
                        </h5>
                        <p className="text-[#939393] text-[12px]">Current Bid</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {item.endsAt ? (
                          <>
                            <div className="flex items-center gap-2">
                              <CountdownBox value={item.endsAt} />
                            </div>
                            <p className="text-[10px] leading-[100%] text-[#939393]">
                              Auction Ends
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-bold text-red-500 capitalize">
                            Status: {item.status}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Total Bids + End Time */}
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <h5 className="text-sm leading-[100%] font-bold text-[#2E3D83]">
                          {item.bids?.length || 0}
                        </h5>
                        <p className="text-[12px] leading-[100%] text-[#939393]">
                          Total Bids
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h5 className="text-sm leading-[100%] font-bold text-[#2E3D83]">
                          {moment(item.endsAt).format('hh:mma DD MMM YYYY')}
                        </h5>
                        <p className="text-[12px] leading-[100%] text-[#939393]">End Time</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Bid Button */}
                  <Link
                    href={`/auctions/${item._id}`}
                    className="w-[386px] h-10 rounded-[5px] border border-[#2E3D83] inline-flex justify-center items-center text-[#2E3D83] font-bold text-base leading-[100%]"
                  >
                    Submit A Bid
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Sidebar */}
        <div className="md:col-span-1 bg-primary p-4 rounded shadow text-white space-y-3">
          <div className="font-semibold mb-3">Filter By</div>
          <input
            className="w-full border rounded px-3 py-2 text-black"
            placeholder="Any Make"
            value={q.make}
            onChange={(e) => setQ({ ...q, make: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2 text-black"
            placeholder="Any Model"
            value={q.model}
            onChange={(e) => setQ({ ...q, model: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2 text-black"
            placeholder="Any Body Type"
            value={q.bodyType}
            onChange={(e) => setQ({ ...q, bodyType: e.target.value })}
          />
          <div className="mt-4 space-y-2">
            <div className="text-sm text-gray-200">
              Price: ${q.minPrice} - ${q.maxPrice}
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              value={q.minPrice}
              onChange={(e) => setQ({ ...q, minPrice: Number(e.target.value) })}
              className="w-full"
            />
            <input
              type="range"
              min={0}
              max={200000}
              value={q.maxPrice}
              onChange={(e) => setQ({ ...q, maxPrice: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}

