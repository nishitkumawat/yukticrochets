import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const read = (key) => {
          try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : [];
          } catch {
            return [];
          }
        };

        const localProducts = read("__admin_products__");
        const localCategories = read("__admin_categories__");

        // Sort products by createdAt desc if present
        localProducts.sort((a, b) => {
          const ta = new Date(a.createdAt || 0).getTime();
          const tb = new Date(b.createdAt || 0).getTime();
          return tb - ta;
        });

        setProducts(localProducts);
        setCategories(localCategories);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const ImageSlider = ({ images, productId }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!images || images.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-beige">
          <span className="text-brown">No image</span>
        </div>
      );
    }

    // Auto-advance slideshow every 3 seconds
    useEffect(() => {
      const id = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(id);
    }, [images.length]);

    return (
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <motion.img
            key={index}
            src={image}
            alt={`Product view ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
            onLoad={() =>
              setImagesLoaded((prev) => ({
                ...prev,
                [`${productId}-${index}`]: true,
              }))
            }
          />
        ))}

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImageIndex(
                  (prev) => (prev - 1 + images.length) % images.length
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white text-brown border border-tan/40 rounded-full p-1 hover:bg-beige/80 transition-colors shadow"
            >
              <svg
                className="w-4 h-4 text-brown"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) => (prev + 1) % images.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-brown border border-tan/40 rounded-full p-1 hover:bg-beige/80 transition-colors shadow"
            >
              <svg
                className="w-4 h-4 text-brown"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors border border-white/70 ${
                    index === currentImageIndex ? "bg-tan" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-4xl font-light text-brown">
          Our Collection
        </h1>
        <p className="mt-3 text-lg text-brown/70 max-w-2xl">
          Handcrafted pieces, lovingly made with attention to detail and quality
          materials.
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 flex flex-wrap gap-3"
      >
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full border transition-all ${
            selectedCategory === "all"
              ? "bg-tan text-white border-tan"
              : "bg-white text-brown border-tan hover:bg-beige"
          }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full border transition-all ${
              selectedCategory === category.id
                ? "bg-tan text-white border-tan"
                : "bg-white text-brown border-tan hover:bg-beige"
            }`}
          >
            {category.name}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-luxe p-6 animate-pulse"
            >
              <div className="aspect-square rounded-xl bg-beige/50 mb-4"></div>
              <div className="h-4 bg-beige/50 rounded mb-2"></div>
              <div className="h-3 bg-beige/50 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-beige/50 rounded w-1/3"></div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className=" rounded-2xl shadow-luxe p-5 hover:shadow-luxe-lg transition-all duration-300 group"
            >
              <div className="aspect-square rounded-xl  overflow-hidden relative mb-4 border border-tan">
                <ImageSlider
                  images={product.imageUrls || [product.imageUrl]}
                  productId={product.id}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-brown text-lg group-hover:text-tan transition-colors">
                    {product.name}
                  </h3>
                  <span className="font-bold text-tan text-lg">
                    $
                    {typeof product.price === "number"
                      ? product.price.toFixed(2)
                      : product.price}
                  </span>
                </div>

                <p className="text-brown text-sm leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                {product.category && (
                  <span className="inline-block px-2 py-1 text-xs bg-tan/10 text-tan rounded-full">
                    {categories.find((cat) => cat.id === product.category)
                      ?.name || product.category}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-brown/40 text-6xl mb-4">🧶</div>
          <h3 className="text-brown text-xl font-semibold mb-2">
            No products found
          </h3>
          <p className="text-brown/60">Try selecting a different category</p>
        </motion.div>
      )}
    </section>
  );
}
