// Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import { Home, ShoppingBag, Mail, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <div className="font-sans bg-[#F5EBDD] text-[#4B382A]">
      <nav className="flex justify-between items-center px-8 py-5 shadow-md bg-white sticky top-0 z-50">
        <h1 className="text-2xl font-bold">Yukti Crochets</h1>
        <ul className="flex space-x-6">
          <li className="flex items-center gap-1 hover:text-[#A47C5B] cursor-pointer">
            <NavLink to="/">
              <Home size={18} /> Home
            </NavLink>
          </li>
          <li className="flex items-center gap-1 hover:text-[#A47C5B] cursor-pointer">
            <NavLink to="/products">
              <ShoppingBag size={18} /> Products
            </NavLink>
          </li>
          <li className="flex items-center gap-1 hover:text-[#A47C5B] cursor-pointer">
            <NavLink to="/contact">
              <Mail size={18} /> Contact Us
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
