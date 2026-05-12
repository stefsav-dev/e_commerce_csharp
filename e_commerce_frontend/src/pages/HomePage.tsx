// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TruckIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon,
  StarIcon,
  ChevronRightIcon,
  HeartIcon,
  FireIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' as const }
};

const fadeInDelay = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: 'easeOut' as const }
});

const HomePage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  // Products data
  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 89.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      rating: 4.5,
      reviews: 128,
      discount: 30
    },
    {
      id: 2,
      name: "Smart Watch Ultra",
      price: 199.99,
      originalPrice: 299.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      rating: 4.8,
      reviews: 95,
      discount: 33
    },
    {
      id: 3,
      name: "Premium Backpack",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
      rating: 4.3,
      reviews: 67,
      isNew: true
    },
    {
      id: 4,
      name: "Sunglasses Collection",
      price: 29.99,
      originalPrice: 59.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      rating: 4.6,
      reviews: 203,
      discount: 50
    }
  ];

  const categories = [
    { name: "Electronics", icon: "📱", color: "from-blue-500 to-cyan-500", count: 245 },
    { name: "Fashion", icon: "👕", color: "from-pink-500 to-rose-500", count: 512 },
    { name: "Home & Living", icon: "🏠", color: "from-emerald-500 to-teal-500", count: 389 },
    { name: "Sports", icon: "⚽", color: "from-orange-500 to-red-500", count: 178 },
    { name: "Books", icon: "📚", color: "from-purple-500 to-indigo-500", count: 156 },
    { name: "Beauty", icon: "💄", color: "from-rose-500 to-pink-500", count: 203 }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Verified Buyer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      content: "Amazing quality products with fast shipping. Highly recommended!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Tech Enthusiast",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      content: "Best online shopping experience ever. Customer support is exceptional.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Fashion Blogger",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      content: "Love the variety and prices. Will definitely shop again!",
      rating: 5
    }
  ];
  const testimonialCount = testimonials.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonialCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonialCount]);

  return (
    <div className="bg-linear-to-b from-gray-50 to-white overflow-x-hidden">
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
        style={{ scaleX: progressScaleX }}
      />

      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              {...fadeIn}
            >
              <motion.div
                {...fadeInDelay(0.05)}
                className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 mb-6"
              >
                <FireIcon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Summer Sale is Live</span>
              </motion.div>
              
              <motion.h1 
                {...fadeInDelay(0.1)}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                Shop Smarter,
                <br />
                <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Live Better
                </span>
              </motion.h1>
              
              <motion.p 
                {...fadeInDelay(0.15)}
                className="text-lg text-gray-600 mb-8 max-w-lg"
              >
                Discover amazing products at unbeatable prices. Free shipping on orders over $50.
              </motion.p>
              
              <motion.div 
                {...fadeInDelay(0.2)}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/products" 
                    className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Shop Now
                    <ArrowRightIcon className="h-5 w-5" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/deals" 
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-indigo-600 transition-all"
                  >
                    View Deals
                    <ChevronRightIcon className="h-5 w-5" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div 
                {...fadeInDelay(0.25)}
                className="grid grid-cols-3 gap-4 mt-12"
              >
                {[
                  { value: "50K+", label: "Happy Customers" },
                  { value: "1000+", label: "Products" },
                  { value: "24/7", label: "Support" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              {...fadeInDelay(0.15)}
              className="relative"
            >
              <motion.img
                src="https://images.unsplash.com/photo-1557821552-17105176677c?w=500"
                alt="Shopping"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
              
              {/* Floating badges */}
              <motion.div
                {...fadeInDelay(0.25)}
                className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold">4.9 Rating</span>
                </div>
              </motion.div>
              
              <motion.div
                {...fadeInDelay(0.3)}
                className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">Free Shipping</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <TruckIcon className="h-8 w-8" />, title: "Free Shipping", description: "Free delivery on orders over $50", color: "from-blue-500 to-cyan-500" },
              { icon: <ShieldCheckIcon className="h-8 w-8" />, title: "Secure Payment", description: "100% secure payment methods", color: "from-green-500 to-emerald-500" },
              { icon: <ArrowPathIcon className="h-8 w-8" />, title: "Easy Returns", description: "30-day return policy", color: "from-purple-500 to-pink-500" },
              { icon: <ClockIcon className="h-8 w-8" />, title: "24/7 Support", description: "Dedicated customer support", color: "from-orange-500 to-red-500" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                {...fadeInDelay(index * 0.08)}
                whileHover={{ y: -4 }}
                className="text-center group cursor-pointer"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex p-4 rounded-2xl bg-linear-to-r ${feature.color} text-white mb-4`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of products across different categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                {...fadeInDelay(index * 0.06)}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/categories/${category.name.toLowerCase()}`}
                  className="block relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all"
                >
                  <div className="aspect-square relative p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} products</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">Hand-picked just for you</p>
            </div>
            <motion.div whileHover={{ x: 10 }}>
              <Link to="#products" className="flex items-center text-indigo-600 hover:text-indigo-700 font-semibold">
                View All
                <ChevronRightIcon className="h-5 w-5 ml-1" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                {...fadeIn}
                whileHover={{ y: -4 }}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all overflow-hidden"
              >
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    -{product.discount}%
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-3 left-3 z-10 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    NEW
                  </div>
                )}
                
                {/* Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md"
                >
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                </motion.button>
                
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-100">
                  <motion.img
                    whileHover={{ scale: 1.03 }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        i < Math.floor(product.rating) ? (
                          <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
                        ) : (
                          <StarIcon key={i} className="h-4 w-4 text-gray-300" />
                        )
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <motion.button
                    whileHover={{ opacity: 0.95 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 bg-linear-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute -inset-x-20 top-0 bottom-0 rotate-12 bg-white opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Summer Mega Sale!
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get up to 50% off on selected items. Limited time offer!
          </p>
          <motion.div
            {...fadeIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link 
              to="/deals" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Shop Now
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </motion.div>
          
          {/* Countdown Timer */}
          <div className="mt-8 flex justify-center gap-6">
            {[
              { label: "Days", value: "05" },
              { label: "Hours", value: "12" },
              { label: "Minutes", value: "30" },
              { label: "Seconds", value: "15" }
            ].map((item, index) => (
              <motion.div
                key={index}
                {...fadeInDelay(index * 0.06)}
                whileHover={{ y: -2 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 min-w-17.5"
              >
                <div className="text-3xl font-bold text-white">{item.value}</div>
                <div className="text-sm text-white/80">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              What Our Customers Say
            </h2>
            <p className="text-gray-600">Join thousands of satisfied customers</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8 text-center"
              >
                <img 
                  src={testimonials[activeTestimonial].image} 
                  alt={testimonials[activeTestimonial].name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-4 italic">
                  "{testimonials[activeTestimonial].content}"
                </p>
                <h4 className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</h4>
                <p className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`transition-all ${
                    activeTestimonial === index ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-300'
                  } h-2 rounded-full`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-linear-to-r from-indigo-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-indigo-100 mb-8">
            Get the latest updates on new products and upcoming sales
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <motion.button
              whileHover={{ opacity: 0.95 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
