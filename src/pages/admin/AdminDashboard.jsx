// src/pages/admin/AdminDashboard.jsx
// Wrapper dashboard page for admin area.
// Renders tabs for Products and Categories and handles logout.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { account } from "../../services/appwrite";
import ProductsManager from "./ProductsManager";
import CategoriesManager from "./CategoriesManager";

export default function AdminDashboard() {
  // Track which admin section is active.
  const [activeTab, setActiveTab] = useState("products");
  const [error, setError] = useState("");

  // Log the admin out by deleting the current Appwrite session.
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      window.location.href = "/admin/login";
    } catch (err) {
      setError(err?.message || "Failed to log out");
    }
  };

  return (
    <div className="min-h-screen bg-beige/10 py-8">
      <section className="max-w-7xl mx-auto px-4">
        {/* Header with title and logout button using existing theme classes */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif text-brown font-light">
              Admin Dashboard
            </h1>
            <p className="text-brown/70 mt-1">Manage products &amp; categories</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab switcher for Products / Categories */}
        <div className="flex border-b border-tan/30 mb-6">
          {["products", "categories"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-tan text-tan"
                  : "text-brown/60 hover:text-brown"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Error banner for any dashboard-level errors */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render the active manager section */}
        {activeTab === "products" ? <ProductsManager /> : <CategoriesManager />}
      </section>
    </div>
  );
}
