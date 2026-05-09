import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";


const Layout = () => {

    const location = useLocation();

    const hideNavbarFooter = ['/login','/register'];
    const shouldHide = hideNavbarFooter.includes(location.pathname);

    return (
        <div className="min-h-screen flex flex-col">
            {!shouldHide && <Navbar/>}
            <main className={`flex-grow ${!shouldHide ? 'pt-16' : ""}`}>
                <Outlet/>
            </main>
            {!shouldHide && <Footer/>}
        </div>
    )
}

export default Layout;