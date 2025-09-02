"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiUser, FiBell, FiLogOut, FiMenu, FiX } from "react-icons/fi"; 
import { useMeQuery } from "@/lib/apis";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Car Auctions", href: "/auctions" },
  { label: "Sell Your Car", href: "/sell" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading } = useMeQuery();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const isHome = pathname === "/";

  return (
    <div
      className={`
        flex justify-between items-center py-4 w-full text-white
        ${isHome ? "absolute top-10" : "relative bg-primary"}
        px-4 md:px-8 lg:px-28
        z-50
      `}
    >
      {/* Logo */}
      <div className="relative w-32 sm:w-40 h-10">
        <Image src="/Logo.png" alt="logo" fill />
      </div>

      {/* Desktop Nav Links */}
      <ul className="hidden lg:flex gap-10 text-white">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`
                  relative pb-1 transition 
                  ${isActive ? "font-bold" : "font-normal"}
                  after:content-[''] after:absolute after:left-0 after:-bottom-1 
                  after:h-[3px] after:w-0 after:bg-yellow-400 after:transition-all after:duration-300
                  hover:after:w-full
                `}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop Auth Buttons */}
      <div className="hidden lg:flex items-center gap-x-4">
        {!isLoading && !user ? (
          <>
            <Link href="/auth/login">Sign in</Link>
            <p className="text-gray-400">or</p>
            <Link
              href="/auth/register"
              className="bg-primary w-28 h-9 border-2 border-white rounded-md flex items-center justify-center"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link href="/profile" className="text-xl hover:text-yellow-400">
              <FiUser />
            </Link>
            <Link href="/notifications" className="text-xl hover:text-yellow-400">
              <FiBell />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>

      {/* Mobile Burger Button */}
      <button
        className="lg:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-primary flex flex-col gap-4 p-6 lg:hidden text-white z-40">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`block ${pathname === link.href ? "font-bold" : "font-normal"}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-3 mt-4">
            {!isLoading && !user ? (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link
                  href="/auth/register"
                  className="bg-white text-primary w-full h-10 flex items-center justify-center rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link href="/notifications" onClick={() => setMenuOpen(false)}>Notifications</Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
