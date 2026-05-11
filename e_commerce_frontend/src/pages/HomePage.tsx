import { useState, useEffect } from "react";
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'; 

const fadeInLeft = {
    hidden: { opacity: 0, x: -100},
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const }}
};

const HomePage = () => {
    const [, setActiveTestimonial] = useState(0);
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const controls = useAnimation();

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const elementPosition = document.getElementById("featured-products")?.offsetTop || 0;

            if (scrollPosition > elementPosition + 100) {
                controls.start("visible");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [controls]);
  const testimonialCount = 3;

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonialCount);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

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
                    transition={{ duration: 13, repeat: Infinity, ease: "linear"}}
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

                    <h2>Coba testing E-Commerce</h2>

            </section>

        </div>
    )
}

export default HomePage;
