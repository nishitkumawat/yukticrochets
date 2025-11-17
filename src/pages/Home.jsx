import { motion } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function LandingPage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Placeholder product images
  const products = [
    {
      name: "Crochet Bag",
      img: "https://source.unsplash.com/400x400/?crochet,bag",
    },
    {
      name: "Handmade Scarf",
      img: "https://source.unsplash.com/400x400/?crochet,scarf",
    },
    {
      name: "Crochet Hat",
      img: "https://source.unsplash.com/400x400/?crochet,hat",
    },
  ];

  return (
    <div className="bg-[#F5EBDD] text-[#4B382A] font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-serif mb-4"
        >
          Yukti Crochets
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-lg md:text-xl max-w-xl mb-10"
        >
          Handcrafted crochet pieces made with love and care. Explore our unique
          collection of handmade accessories.
        </motion.p>

        {/* SVG / PNG Thread & Ball */}
        <motion.img
          src="https://www.svgrepo.com/show/354365/crochet.svg" // Example placeholder
          alt="Crochet thread and ball"
          className="w-48 h-48 md:w-64 md:h-64 mb-12"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.5 }}
        />
      </section>

      {/* Products Section */}
      <section className="px-4 md:px-20 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, idx) => (
          <motion.div
            key={product.name}
            data-aos="fade-up"
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          >
            <motion.img
              src={product.img}
              alt={product.name}
              className="w-full h-64 object-cover"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            />
            <div className="p-4 text-center font-semibold">{product.name}</div>
          </motion.div>
        ))}
      </section>

      {/* Articles Section */}
      <section className="px-4 md:px-20 py-16 space-y-16">
        {/* Article 1 */}
        <div
          className="flex flex-col md:flex-row items-center gap-8"
          data-aos="fade-right"
        >
          <div className="md:w-1/2">
            <h2 className="text-2xl font-serif mb-4">The Art of Crochet</h2>
            <p className="text-[#4B382A]/80">
              Discover how each piece is handcrafted with attention to detail
              and a personal touch. Crochet is not just art, it's love.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://source.unsplash.com/600x400/?crochet,art"
              alt="Crochet Art"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Article 2 */}
        <div
          className="flex flex-col md:flex-row-reverse items-center gap-8"
          data-aos="fade-left"
        >
          <div className="md:w-1/2">
            <h2 className="text-2xl font-serif mb-4">
              Unique Handmade Accessories
            </h2>
            <p className="text-[#4B382A]/80">
              Our collection includes bags, scarves, hats and more, all made
              with care and attention to detail.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://source.unsplash.com/600x400/?crochet,accessories"
              alt="Crochet Accessories"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* View All Products Button */}
      <div className="text-center py-10">
        <button className="bg-[#4B382A] text-[#F5EBDD] px-8 py-3 rounded-full font-semibold hover:bg-[#382A20] transition">
          View All Products
        </button>
      </div>

      {/* Quote / Testimonials Section */}
      <section className="py-16 bg-[#EDE6D9]">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-serif">We Love Good Compliments</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-20">
          {[
            {
              text: "More than expected crazy soft, flexible and best fitted.",
              title: "Casual Way",
            },
            {
              text: "Best fitted white denim shirt more than expected crazy soft.",
              title: "Uptop",
            },
            {
              text: "Flexible crazy soft, best fitted and stylish.",
              title: "Denim Craze",
            },
            {
              text: "Best quality crochet products, highly recommended.",
              title: "Handmade Love",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
              data-aos="zoom-in"
            >
              <blockquote className="text-sm text-[#4B382A]/80 mb-4">
                “{item.text}”
              </blockquote>
              <div className="font-semibold uppercase">{item.title}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4B382A] text-[#F5EBDD] py-6 text-center">
        &copy; {new Date().getFullYear()} Yukti Crochets. All rights reserved.
      </footer>
    </div>
  );
}
