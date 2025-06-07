import React from 'react';
import LogOut from '../components/LogOut'
export default function NavBar() {
    return (
        <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-2xl font-bold">MyBrand</div>
                    <ul className="hidden md:flex space-x-8 text-lg">
                            {/* <li><a href="#" className="hover:text-yellow-300">Home</a></li>
                            <li><a href="#" className="hover:text-yellow-300">About</a></li>
                            <li><a href="#" className="hover:text-yellow-300">Services</a></li>
                            <li><a href="#" className="hover:text-yellow-300">Contact</a></li> */}
                    </ul>
                <LogOut/>
            </div>
        </nav>
    );
}