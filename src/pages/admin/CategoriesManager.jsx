// src/pages/admin/CategoriesManager.jsx
// Admin-side CRUD for product categories backed by Appwrite Databases.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  databases,
  DB_ID,
  CATEGORIES_COLLECTION_ID,
  generateId,
} from "../../services/appwrite";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load all categories from Appwrite.
  const loadCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await databases.listDocuments(DB_ID, CATEGORIES_COLLECTION_ID);
      setCategories(res.documents);
    } catch (err) {
      setError(err?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Create a new category document.
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await databases.createDocument(
        DB_ID,
        CATEGORIES_COLLECTION_ID,
        generateId(),
        { name: categoryName.trim() }
      );
      setCategoryName("");
      await loadCategories();
    } catch (err) {
      setError(err?.message || "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  // Delete an existing category by document id.
  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    setError("");
    try {
      await databases.deleteDocument(
        DB_ID,
        CATEGORIES_COLLECTION_ID,
        category.$id
      );
      await loadCategories();
    } catch (err) {
      setError(err?.message || "Failed to delete category");
    }
  };

  return (
    <div>
      {/* Add category form using existing theme styling */}
      <motion.form
        onSubmit={handleAddCategory}
        className="bg-white shadow-md rounded-2xl p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-serif text-brown font-light mb-4">
          Add New Category
        </h2>
        <div className="flex gap-3">
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="flex-1 border border-tan/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tan/50 focus:border-tan transition-all"
            placeholder="Category Name"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-tan text-white rounded-xl font-medium hover:bg-tan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Adding..." : "Add"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </motion.form>

      {/* Categories list grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-2xl p-4 h-20 animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-brown/70">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.$id}
              className="bg-white shadow-md rounded-2xl p-4 flex justify-between items-center"
            >
              <span className="text-brown font-medium">{cat.name}</span>
              <button
                onClick={() => handleDeleteCategory(cat)}
                className="text-red-500 hover:text-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
