import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";


const Layout = () => {
    return (
        <div className="min-h-screen">
            <Navbar/>
            <main className="flex-grow pt-16">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}

export default Layout;