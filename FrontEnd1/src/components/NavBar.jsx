import React, { useState } from "react";
import { ShoppingCart, User } from "lucide-react";
import { IoMdClose } from "react-icons/io";

export default function Navigation() {
  const [showProfile, setShowProfile] = useState(false);

  const profileData = {
    name: "Pramod Kumar",
    age: 24,
    email: "pramod@example.com",
    phone: "+91 9876543210",
    address: "Punjab, India",
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hidden sm:block">
                StyleCart
              </span>
            </div>

            {/* Right: Profile Icon */}
            <button onClick={() => setShowProfile(true)}>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Dimmed Background */}
      {showProfile && (
        <div
          onClick={() => setShowProfile(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        />
      )}

      {/* Slide-in Profile Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          showProfile ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg text-blue-700">User Profile</h2>
          <IoMdClose
            className="text-2xl cursor-pointer text-red-500"
            onClick={() => setShowProfile(false)}
          />
        </div>
        <div className="p-4 space-y-3 text-sm text-gray-700">
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Age:</strong> {profileData.age}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Phone:</strong> {profileData.phone}</p>
          <p><strong>Address:</strong> {profileData.address}</p>
        </div>
      </div>
    </>
  );
}
