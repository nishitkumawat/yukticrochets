// src/pages/admin/ProductsManager.jsx
// Admin-side CRUD for products using Appwrite Databases & Storage.
// Supports uploading up to 5 images per product.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  databases,
  storage,
  DB_ID,
  PRODUCTS_COLLECTION_ID,
  CATEGORIES_COLLECTION_ID,
  IMAGES_BUCKET_ID,
  generateId,
  buildPublicFileUrl,
} from "../../services/appwrite";

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    imageFiles: [],
  });

  // Fetch products and categories from Appwrite.
  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        databases.listDocuments(DB_ID, PRODUCTS_COLLECTION_ID),
        databases.listDocuments(DB_ID, CATEGORIES_COLLECTION_ID),
      ]);

      // Sort products by Appwrite's $createdAt (newest first).
      const docs = productsRes.documents.slice().sort((a, b) => {
        const ta = new Date(a.$createdAt || 0).getTime();
        const tb = new Date(b.$createdAt || 0).getTime();
        return tb - ta;
      });

      setProducts(docs);
      setCategories(categoriesRes.documents);
    } catch (err) {
      setError(err?.message || "Failed to load products and categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Basic product form validation before sending to Appwrite.
  const validateProduct = () => {
    if (!productForm.name.trim()) return "Product name is required";
    if (!productForm.price || isNaN(Number(productForm.price)))
      return "Valid price is required";
    if (!productForm.description.trim()) return "Description is required";
    if (!productForm.categoryId) return "Category is required";
    if (productForm.imageFiles.length === 0)
      return "At least one image is required";
    if (productForm.imageFiles.length > 5)
      return "You can upload up to 5 images only";
    return "";
  };

  // Upload selected image files to Appwrite Storage and return public URLs.
  const uploadImages = async (files) => {
    const urls = [];
    for (const file of files) {
      // Create a file in the configured images bucket.
      // eslint-disable-next-line no-await-in-loop
      const created = await storage.createFile(IMAGES_BUCKET_ID, generateId(), file);
      const url = buildPublicFileUrl(created.$id);
      urls.push(url);
    }
    return urls;
  };

  // Create a new product document with image URLs.
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const validationError = validateProduct();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const imageUrls = await uploadImages(productForm.imageFiles);

      // Create the product document using the schema:
      // $id, name, price, category_id, images, description, $createdAt, $updatedAt.
      await databases.createDocument(
        DB_ID,
        PRODUCTS_COLLECTION_ID,
        generateId(),
        {
          name: productForm.name.trim(),
          price: Number(productForm.price),
          description: productForm.description.trim(),
          category_id: productForm.categoryId,
          images: imageUrls,
        }
      );

      // Reset form after successful creation.
      setProductForm({
        name: "",
        price: "",
        description: "",
        categoryId: "",
        imageFiles: [],
      });

      await loadData();
    } catch (err) {
      setError(err?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  // Delete a product document (files cleanup is optional and can be added later).
  const handleDeleteProduct = async (product) => {
    if (!window.confirm("Delete this product?")) return;
    setError("");
    try {
      await databases.deleteDocument(DB_ID, PRODUCTS_COLLECTION_ID, product.$id);
      await loadData();
    } catch (err) {
      setError(err?.message || "Failed to delete product");
    }
  };

  return (
    <div>
      {/* Product creation form */}
      <motion.form
        onSubmit={handleSubmitProduct}
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
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm((f) => ({ ...f, categoryId: e.target.value }))
              }
              className="w-full border border-tan/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tan/50 focus:border-tan transition-all"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.$id} value={cat.$id}>
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
                setProductForm((f) => ({ ...f, description: e.target.value }))
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
                  imageFiles: Array.from(e.target.files || []),
                }))
              }
              className="w-full border border-tan/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tan/50 focus:border-tan transition-all"
            />
            {productForm.imageFiles.length > 0 && (
              <p className="text-brown/70 text-sm">
                {productForm.imageFiles.length} image(s) selected (max 5)
              </p>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="mt-4 px-6 py-3 bg-tan text-white rounded-xl font-medium hover:bg-tan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Adding..." : "Add Product"}
        </button>
      </motion.form>

      {/* Products list */}
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
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-brown/70">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.$id}
                className="bg-white shadow-md rounded-2xl p-4 flex flex-col"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown/40">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="text-brown font-semibold">{product.name}</h3>
                <p className="text-brown/70 text-sm line-clamp-2">
                  {product.description}
                </p>
                <span className="text-tan font-bold mt-1">
                  ₹{product.price}
                </span>
                {product.category_id && (
                  <span className="inline-block bg-tan/20 text-tan px-2 py-1 rounded-full text-xs mt-1">
                    {categories.find((cat) => cat.$id === product.category_id)
                      ?.name ||
                      product.category_id}
                  </span>
                )}
                <button
                  onClick={() => handleDeleteProduct(product)}
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
  );
}
