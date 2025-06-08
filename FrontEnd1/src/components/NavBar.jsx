import React, { useState } from "react";
import { User } from "lucide-react";
import { IoMdClose } from "react-icons/io";

export default function Navigation() {
  const [showProfile, setShowProfile] = useState(false);

  const profileData = {
    name: "NK Patil Construction",
    age: "29EPKPP2663M1Z1",
    email: "nkpatil3980@gmail.com",
    phone: "+91 9448111276",
    address: "BELAGAVI 591108",
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16">
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
        <div className="p-4 space-y-3 text-sm text-gray-700 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
            NK
          </div>
          <p className="font-semibold text-base text-blue-700">{profileData.name}</p>
          <p><strong>GST No:</strong> {profileData.age}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Phone:</strong> {profileData.phone}</p>
          <p><strong>Address:</strong> {profileData.address}</p>
        </div>
      </div>
    </>
  );
}
