// LandingPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Mail } from "lucide-react";
import Navbar from "../components/Navbar";

const products = [
  { id: 1, name: "Crochet Bag", image: "/images/product1.jpg" },
  { id: 2, name: "Crochet Hat", image: "/images/product2.jpg" },
  { id: 3, name: "Crochet Scarf", image: "/images/product3.jpg" },
  { id: 4, name: "Crochet Doll", image: "/images/product4.jpg" },
];

const highlights = [
  { id: 1, text: "Handmade with Love", image: "/images/highlight1.jpg" },
  { id: 2, text: "Premium Quality Materials", image: "/images/highlight2.jpg" },
  { id: 3, text: "Unique Designs", image: "/images/highlight3.jpg" },
];

const LandingPage = () => {
  return (
    <div className="font-sans bg-[#F5EBDD] text-[#4B382A]">
      {/* Navbar */}

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-8 py-20 md:py-32 overflow-hidden">
        {/* Left Semi-Circle */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-[#E6D5B8] w-[500px] h-[500px] rounded-l-full absolute left-0 top-1/4 md:top-1/3 -z-10"
        />
        {/* Left Text */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="md:w-1/2 z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Yukti Crochets
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Handcrafted crochet products made with love and care. Explore unique
            designs and premium quality that add warmth and charm to your
            lifestyle.
          </p>
        </motion.div>
        {/* Right Circle Image */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="md:w-1/2 flex justify-center"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-xl">
            <img
              src="/images/hero.jpg"
              alt="Crochet Highlight"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* Decorative thread strip */}
      <div className="w-full h-16 bg-white relative">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#E6D5B8"
            d="M0,128L40,144C80,160,160,192,240,208C320,224,400,224,480,218.7C560,213,640,203,720,197.3C800,192,880,192,960,197.3C1040,203,1120,213,1200,197.3C1280,181,1360,139,1400,117.3L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
        </svg>
      </div>

      {/* Products Section */}
      <section className="px-8 py-20 md:py-32">
        <h3 className="text-3xl font-bold text-center mb-12">
          Our Featured Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 text-center font-semibold">
                {product.name}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-white px-8 py-20 md:py-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {highlights.map((highlight) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center p-4"
            >
              <img
                src={highlight.image}
                alt={highlight.text}
                className="w-32 h-32 object-cover rounded-full mb-4 shadow-md"
              />
              <p className="text-lg font-medium">{highlight.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20 text-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="bg-[#A47C5B] text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg"
        >
          Explore All Products
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="bg-[#4B382A] text-white py-12 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Yukti Crochets. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#E6D5B8]">
              Instagram
            </a>
            <a href="#" className="hover:text-[#E6D5B8]">
              Facebook
            </a>
            <a href="#" className="hover:text-[#E6D5B8]">
              Pinterest
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
