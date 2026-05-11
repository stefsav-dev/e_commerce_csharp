import { useState, useEffect } from "react";
import { motion, useAnimation, useScroll, useTransform, AnimatePresense } from 'framer-motion'; 
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon,
  StarIcon,
  ChevronRightIcon,
  HeartIcon,
  FireIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';


const fadeInUp = {
    hidden: { opacity: 0, y: 70},
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut"}}
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -100},
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut"}}
};

const fadeInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut"}}
};

const staggerContainer = {
    hidden: { opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const scaleUp = {
    hidden: { opacity: 0, scale: 0.8},
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, type: "spring", stiffness: 100}
    }
};

const HomePage = () => {

    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const controls = useAnimation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const elementPosition = document.getElementById("featured-products")?.offsetTop || 0;

            if (scrollPosition > elementPosition + 100) {
                setIsVisible(true);
                controls.start("visible");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [controls]);


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

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    },[]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">

        {/* progress bar */}

            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 z-50"
                style={{ scaleX, transformOrigin: "0%"}}
            />


            {/* hero section */}

            <section className="relative min-h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10"/>

                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        borderRadius: ["50%", "30%", "50%"]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear"}}
                    className="absolute top-20 left-10 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.3, 1, 1.3],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 13, repeate: Infinity, ease: "linear"}}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
                />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32"/>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInLeft}
                        >
                            
                        </motion.div>
                    </div>

            </section>

        </div>
    )
}

export default HomePage;
