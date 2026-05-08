// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TruckIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon,
  StarIcon,
  ChevronRightIcon,
  HeartIcon,
  FireIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface Category {
  id: number;
  name: string;
  image: string;
  count: number;
  icon: string;
}

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Mock data - In real app, fetch from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFeaturedProducts(mockFeaturedProducts);
      setTrendingProducts(mockTrendingProducts);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Categories Section */}
      <CategoriesSection />
      
      {/* Featured Products */}
      <FeaturedProductsSection 
        products={featuredProducts} 
        isLoading={isLoading} 
      />
      
      {/* Promo Banner */}
      <PromoBanner />
      
      {/* Trending Products */}
      <TrendingProductsSection 
        products={trendingProducts} 
        isLoading={isLoading} 
      />
      
      {/* Testimonials */}
      <TestimonialsSection 
        activeIndex={activeTestimonial}
        setActiveIndex={setActiveTestimonial}
      />
      
      {/* Newsletter Section */}
      <NewsletterSection />
      
      {/* Back to Top Button */}
      <BackToTopButton />
      
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center md:text-left md:flex md:items-center md:justify-between">
          <div className="md:flex-1 animate-fade-in-up">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <FireIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Summer Sale is Live</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Shop Smarter,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Live Better
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-lg mx-auto md:mx-0">
              Discover amazing products at unbeatable prices. Free shipping on orders over $50.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/products" 
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Shop Now
              </Link>
              <Link 
                to="/deals" 
                className="px-8 py-3 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                View Deals
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto md:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-gray-200">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-gray-200">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-gray-200">Support</div>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block md:flex-1 animate-float">
            <img 
              src="https://images.unsplash.com/photo-1557821552-17105176677c?w=500" 
              alt="Shopping illustration"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
      
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#f9fafb" fillOpacity="1" d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,234.7C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <TruckIcon className="h-8 w-8" />,
      title: "Free Shipping",
      description: "Free delivery on orders over $50",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Secure Payment",
      description: "100% secure payment methods",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <ArrowPathIcon className="h-8 w-8" />,
      title: "Easy Returns",
      description: "30-day return policy",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <ClockIcon className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Dedicated customer support",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-16 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center group cursor-pointer"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Categories Section
const CategoriesSection = () => {
  const categories: Category[] = [
    {
      id: 1,
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
      count: 245,
      icon: "📱"
    },
    {
      id: 2,
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
      count: 512,
      icon: "👕"
    },
    {
      id: 3,
      name: "Home & Living",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400",
      count: 389,
      icon: "🏠"
    },
    {
      id: 4,
      name: "Sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe807baaab9?w=400",
      count: 178,
      icon: "⚽"
    },
    {
      id: 5,
      name: "Books",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
      count: 156,
      icon: "📚"
    },
    {
      id: 6,
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      count: 203,
      icon: "💄"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
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
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square relative">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="text-3xl mb-1">{category.icon}</div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.count} products</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured Products Section
const FeaturedProductsSection = ({ products, isLoading }: { products: Product[]; isLoading: boolean }) => {
  if (isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">Hand-picked just for you</p>
          </div>
          <Link 
            to="/products" 
            className="flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
          >
            View All 
            <ChevronRightIcon className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
          -{product.discount}%
        </div>
      )}
      
      {/* New Badge */}
      {product.isNew && (
        <div className="absolute top-3 left-3 z-10 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
          NEW
        </div>
      )}
      
      {/* Wishlist Button */}
      <button 
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
      >
        <HeartIcon className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
      </button>
      
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Quick View Overlay */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transform -translate-y-2 group-hover:translate-y-0 transition-all">
            Quick View
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              index < Math.floor(product.rating) ? (
                <StarSolidIcon key={index} className="h-4 w-4 text-yellow-400" />
              ) : (
                <StarIcon key={index} className="h-4 w-4 text-gray-300" />
              )
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// Promo Banner
const PromoBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute -inset-x-20 top-0 bottom-0 bg-white opacity-10 transform rotate-12"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Summer Mega Sale!
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Get up to 50% off on selected items. Limited time offer!
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            to="/deals" 
            className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Shop Now
          </Link>
          <Link 
            to="/products" 
            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all"
          >
            Learn More
          </Link>
        </div>
        
        {/* Countdown Timer Example */}
        <div className="mt-8 flex justify-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">05</div>
            <div className="text-sm text-white/80">Days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">12</div>
            <div className="text-sm text-white/80">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">30</div>
            <div className="text-sm text-white/80">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">15</div>
            <div className="text-sm text-white/80">Seconds</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Trending Products Section
const TrendingProductsSection = ({ products, isLoading }: { products: Product[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-80 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Trending Now 🔥
          </h2>
          <p className="text-gray-600">Most popular products this week</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
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

const TestimonialsSection = ({ activeIndex, setActiveIndex }: { activeIndex: number; setActiveIndex: (index: number) => void }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-600">Join thousands of satisfied customers</p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gray-50 rounded-2xl p-8 text-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeIndex === index ? 'w-8 bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Newsletter Section
const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };
  
  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-blue-100 mb-8">
          Get the latest updates on new products and upcoming sales
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

// Back to Top Button
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 z-50 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

// Loading Skeleton
const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
          <div className="bg-gray-200 rounded-xl h-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};

// Mock Data
const mockFeaturedProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones with Noise Cancellation",
    price: 89.99,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    rating: 4.5,
    reviews: 128,
    discount: 30,
    isFeatured: true
  },
  {
    id: 2,
    name: "Smart Watch Ultra",
    price: 199.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    rating: 4.8,
    reviews: 95,
    discount: 33,
    isFeatured: true
  },
  {
    id: 3,
    name: "Premium Backpack",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    rating: 4.3,
    reviews: 67,
    isNew: true,
    isFeatured: true
  },
  {
    id: 4,
    name: "Sunglasses Collection",
    price: 29.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    rating: 4.6,
    reviews: 203,
    discount: 50,
    isFeatured: true
  }
];

const mockTrendingProducts: Product[] = [
  {
    id: 5,
    name: "Smartphone Pro Max",
    price: 999.99,
    originalPrice: 1199.99,
    image: "https://images.unsplash.com/photo-1592899677977-9e10cb2be1ad?w=400",
    rating: 4.9,
    reviews: 542,
    discount: 16
  },
  {
    id: 6,
    name: "Fitness Tracker",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400",
    rating: 4.4,
    reviews: 189,
    isNew: true
  },
  {
    id: 7,
    name: "Laptop Backpack",
    price: 39.99,
    originalPrice: 69.99,
    image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=400",
    rating: 4.7,
    reviews: 234,
    discount: 42
  },
  {
    id: 8,
    name: "Wireless Mouse",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    rating: 4.5,
    reviews: 156
  }
];

export default HomePage;
