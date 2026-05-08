import { Routes, Route } from 'react-router-dom';
import Layout from "../components/layout/Layout";
import PrivateRoute from "./PrivateRoutes";

import { lazy, Suspense } from "react";
import Loader from "../components/common/Loader";

const HomePage = lazy(() => import("../pages/HomePage"));
// const ProductsPage = lazy(() => import("../pages/ProductsPage"));
// const ProductsDetailPage = lazy(() => import("../pages/ProductsDetailPage"));
// const CartPage = lazy(() => import("../pages/CartPage"));
// const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
// const WishlistPage = lazy(() => import("../pages/WishlistPage"));
// const ProfilePage = lazy(() => import("../pages/ProfilePage"));
// const LoginPage = lazy(() => import("../pages/LoginPage"));
// const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<Loader/>}>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    
                    {/* public routes */}

                    <Route index element={<HomePage/>}/>
                    {/* <Route path="products" element={<ProductsPage/>}/>
                    <Route path="products/:id" element={<ProductsDetailPage/>}/>
                    <Route path="cart" element={<CartPage/>}/>
                    <Route path="login" element={<LoginPage/>}/> */}


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