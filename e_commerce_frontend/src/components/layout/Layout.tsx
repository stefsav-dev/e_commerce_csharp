// src/components/layout/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { useAppSelector } from "../../store/hooks";

const Layout = () => {
    const location = useLocation();
    const user = useAppSelector((state) => state.auth.user);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    
    const hideNavbarFooter = ['/login', '/register'];
    const shouldHide = hideNavbarFooter.includes(location.pathname);
    
    const isAdmin = isAuthenticated && user?.role === 'admin';
    
    if (isAdmin) {
        return (
            <div className="min-h-screen">
                <Outlet />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex flex-col">
            {!shouldHide && <Navbar />}
            <main className={`flex-grow ${!shouldHide ? 'pt-16' : ''}`}>
                <Outlet />
            </main>
            {!shouldHide && <Footer />}
        </div>
    );
};

export default Layout;