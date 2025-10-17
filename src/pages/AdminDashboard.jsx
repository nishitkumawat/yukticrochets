import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    imageFiles: [],
  });

  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [addingCategory, setAddingCategory] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  // Local storage helpers (replace Appwrite data layer)
  const STORAGE_KEYS = {
    products: "__admin_products__",
    categories: "__admin_categories__",
  };

  const loadFromStorage = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const generateId = () => Math.random().toString(36).slice(2, 10);

  const loadData = async () => {
    setLoading(true);
    try {
      const loadedProducts = loadFromStorage(STORAGE_KEYS.products);
      const loadedCategories = loadFromStorage(STORAGE_KEYS.categories);
      setProducts(loadedProducts);
      setCategories(loadedCategories);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const validateProduct = () => {
    if (!productForm.name.trim()) return "Product name is required";
    if (!productForm.price || isNaN(Number(productForm.price)))
      return "Valid price is required";
    if (!productForm.description.trim()) return "Description is required";
    if (!productForm.category) return "Category is required";
    if (productForm.imageFiles.length === 0)
      return "At least one image is required";
    return "";
  };

  const uploadImages = async (files) => {
    // Convert selected files to data URLs for local preview/storage
    const toDataUrl = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    const urls = [];
    for (const file of files) {
      // eslint-disable-next-line no-await-in-loop
      const url = await toDataUrl(file);
      urls.push(url);
    }
    return urls;
  };

  const onSubmitProduct = async (e) => {
    e.preventDefault();
    const validationError = validateProduct();
    if (validationError) return setError(validationError);

    setSaving(true);
    setError("");
    try {
      const imageUrls = await uploadImages(productForm.imageFiles);
      const newProduct = {
        id: generateId(),
        name: productForm.name,
        price: Number(productForm.price),
        description: productForm.description,
        category: productForm.category,
        imageUrls,
        createdAt: new Date().toISOString(),
      };
      const updated = [...loadFromStorage(STORAGE_KEYS.products), newProduct];
      saveToStorage(STORAGE_KEYS.products, updated);
      setProductForm({
        name: "",
        price: "",
        description: "",
        category: "",
        imageFiles: [],
      });
      await loadData();
    } catch (err) {
      setError("Failed to save product: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const onDeleteProduct = async (product) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const current = loadFromStorage(STORAGE_KEYS.products);
      const filtered = current.filter((p) => p.id !== product.id);
      saveToStorage(STORAGE_KEYS.products, filtered);
      await loadData();
    } catch {
      setError("Failed to delete product");
    }
  };

  const onSubmitCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return setError("Category name is required");

    setAddingCategory(true);
    setError("");
    try {
      const newCategory = {
        id: generateId(),
        name: categoryForm.name.trim(),
        createdAt: new Date().toISOString(),
      };
      const updated = [
        ...loadFromStorage(STORAGE_KEYS.categories),
        newCategory,
      ];
      saveToStorage(STORAGE_KEYS.categories, updated);
      setCategoryForm({ name: "" });
      await loadData();
    } catch (err) {
      setError("Failed to add category: " + (err?.message || "Unknown error"));
    } finally {
      setAddingCategory(false);
    }
  };

  const onDeleteCategory = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      const current = loadFromStorage(STORAGE_KEYS.categories);
      const filtered = current.filter((c) => c.id !== category.id);
      saveToStorage(STORAGE_KEYS.categories, filtered);
      await loadData();
    } catch {
      setError("Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-beige/10 py-8">
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif text-brown font-light">
              Admin Dashboard
            </h1>
            <p className="text-brown/70 mt-1">Manage products & categories</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                try {
                  setSaving(true);
                  setError("");
                  // Seed demo data in localStorage
                  const demoCategory = {
                    id: generateId(),
                    name: "Demo Category",
                    createdAt: new Date().toISOString(),
                  };
                  const cats = loadFromStorage(STORAGE_KEYS.categories);
                  saveToStorage(STORAGE_KEYS.categories, [
                    ...cats,
                    demoCategory,
                  ]);

                  const demoProduct = {
                    id: generateId(),
                    name: "Demo Product",
                    price: 9.99,
                    description: "Seeded product for testing",
                    category: demoCategory.id,
                    imageUrls: [],
                    createdAt: new Date().toISOString(),
                  };
                  const prods = loadFromStorage(STORAGE_KEYS.products);
                  saveToStorage(STORAGE_KEYS.products, [...prods, demoProduct]);

                  await loadData();
                } catch (e) {
                  setError("Seed failed: " + (e?.message || "Unknown error"));
                } finally {
                  setSaving(false);
                }
              }}
              className="px-6 py-2 bg-tan text-white rounded-xl hover:bg-tan/90 transition-colors font-medium"
            >
              Seed demo data
            </button>
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>

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

        {activeTab === "products" && (
          <div>
            <motion.form
              onSubmit={onSubmitProduct}
              className="bg-white shadow-md rounded-2xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-serif text-brown font-light mb-6">
                Add New Product
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input
                    placeholder="Product Name"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full border border-tan/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tan/50 focus:border-tan transition-all"
                  />
                  <input
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm((f) => ({ ...f, price: e.target.value }))
                    }
                    className="w-full border border-tan/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tan/50 focus:border-tan transition-all"
                  />
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm((f) => ({
                        ...f,
                        category: e.target.value,
                      }))
                    }
                    className="w-full border border-tan/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tan/50 focus:border-tan transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <textarea
                    placeholder="Description"
                    rows={4}
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-tan/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tan/50 focus:border-tan transition-all"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setProductForm((f) => ({
                        ...f,
                        imageFiles: Array.from(e.target.files),
                      }))
                    }
                    className="w-full border border-tan/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tan/50 focus:border-tan transition-all"
                  />
                  {productForm.imageFiles.length > 0 && (
                    <p className="text-brown/70 text-sm">
                      {productForm.imageFiles.length} image(s) selected
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-4 px-6 py-3 bg-tan text-white rounded-xl font-medium hover:bg-tan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Adding..." : "Add Product"}
              </button>
            </motion.form>

            <div>
              <h2 className="text-2xl font-serif text-brown font-light mb-4">
                All Products ({products.length})
              </h2>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl shadow-md p-6 animate-pulse h-64"
                    ></div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <p className="text-brown/70">No products yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white shadow-md rounded-2xl p-4 flex flex-col"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-3">
                        {product.imageUrls?.[0] ? (
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brown/40">
                            No Image
                          </div>
                        )}
                      </div>
                      <h3 className="text-brown font-semibold">
                        {product.name}
                      </h3>
                      <p className="text-brown/70 text-sm line-clamp-2">
                        {product.description}
                      </p>
                      <span className="text-tan font-bold mt-1">
                        ${product.price}
                      </span>
                      {product.category && (
                        <span className="inline-block bg-tan/20 text-tan px-2 py-1 rounded-full text-xs mt-1">
                          {
                            categories.find(
                              (cat) => cat.id === product.category
                            )?.name
                          }
                        </span>
                      )}
                      <button
                        onClick={() => onDeleteProduct(product)}
                        className="mt-auto px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div>
            <motion.form
              onSubmit={onSubmitCategory}
              className="bg-white shadow-md rounded-2xl p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-serif text-brown font-light mb-4">
                Add New Category
              </h2>
              <div className="flex gap-3">
                <input
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ name: e.target.value })}
                  className="flex-1 border border-tan/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tan/50 focus:border-tan transition-all"
                  placeholder="Category Name"
                />
                <button
                  type="submit"
                  disabled={addingCategory}
                  className="px-6 py-3 bg-tan text-white rounded-xl font-medium hover:bg-tan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingCategory ? "Adding..." : "Add"}
                </button>
              </div>
            </motion.form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white shadow-md rounded-2xl p-4 flex justify-between items-center"
                >
                  <span className="text-brown font-medium">{cat.name}</span>
                  <button
                    onClick={() => onDeleteCategory(cat)}
                    className="text-red-500 hover:text-red-700 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
