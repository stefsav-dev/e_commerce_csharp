import { Routes, Route } from 'react-router-dom';
import Layout from "../components/layout/Layout";
import PrivateRoute from "./PrivateRoutes";

import { lazy, Suspense } from "react";
import Loader from "../components/common/Loader";
import NotFoundPage from '../pages/NotFoundPage';

const HomePage = lazy(() => import("../pages/HomePage"));
// const ProductsPage = lazy(() => import("../pages/ProductsPage"));
// const ProductsDetailPage = lazy(() => import("../pages/ProductsDetailPage"));
// const CartPage = lazy(() => import("../pages/CartPage"));
// const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
// const WishlistPage = lazy(() => import("../pages/WishlistPage"));
// const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
// const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<Loader/>}>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    
                    {/* public routes */}

                    <Route index element={<HomePage/>}/>
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="register" element={<RegisterPage/>}/>
                    


                    {/* Private Routes */}
                    <Route element={<PrivateRoute/>}>
                        {/* <Route path="checkout" element={<CheckoutPage/>}/>
                        <Route path="wishlist" element={<WishlistPage/>}/>
                        <Route path="profile" element={<ProfilePage/>}/> */}
                    </Route>


                    {/* <Route path="*" element={<NotFoundPage/>}/> */}
                </Route>
            </Routes>
        </Suspense>
    )
}

export default AppRoutes;