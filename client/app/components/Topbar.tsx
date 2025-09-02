import React from "react";
import { MdOutlineEmail } from "react-icons/md";

export default function Topbar() {
  return (
    <div className="w-full bg-primary py-2 text-white flex justify-between px-28 items-center">
      <h1>Call Us &nbsp; 123456789</h1>
      <h1 className="flex gap-x-3 items-center">
        <MdOutlineEmail className="text-xl" />
        <p>Email Id &nbsp; info@cardeposit.com</p>
      </h1>
    </div>
  );
}
