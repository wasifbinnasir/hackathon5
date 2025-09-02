import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-10">
      <div className="container mx-auto px-6 md:px-20 grid md:grid-cols-3 gap-10">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative w-40 h-8">
              <Image src="/Logo.png" alt="logo" fill className="object-contain" />
            </div>
           
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Mauris eu convallis
            purus turpis pretium donec orci semper. Sit suscipit lacus cras
            commodo in lectus sed egestas. Mattis egestas sit viverra pretium
            tincidunt libero. Suspendisse aliquam donec leo nisi purus et quam
            pulvinar.
          </p>
        </div>

        {/* First Column */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="hover:underline font-semibold">Home</Link>
          <Link href="/help" className="hover:underline">Help Center</Link>
          <Link href="/faq" className="hover:underline">FAQ</Link>
        </div>

        {/* Second Column */}
        <div className="flex flex-col gap-2">
          <Link href="/auction" className="hover:underline font-semibold">Car Auction</Link>
          <Link href="/help" className="hover:underline">Help Center</Link>
          <Link href="/account" className="hover:underline">My Account</Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-600 mt-10 pt-4 text-center text-sm text-gray-300">
        Copyright © 2022 All Rights Reserved
      </div>
    </footer>
  );
}
