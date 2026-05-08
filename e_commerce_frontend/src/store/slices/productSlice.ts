import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
    category: string;
    description?: string;
    stock: number;
}

interface ProductState {
    products: Product[],
    featuredProducts: Product[],
    trendingProducts: Product[],
    selectedProduct: Product | null;
    isLoading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
}

const initialState: ProductState = {
    products: [],
    featuredProducts: [],
    trendingProducts: [],
    selectedProduct: null,
    isLoading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
}

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        fetchProductsStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchProductsSuccess: (state, action: PayloadAction<{ products: Product[]; totalPages: number }>) => {
            state.isLoading = false;
            state.products = action.payload.products;
            state.totalPages = action.payload.totalPages;
            state.error = null;
        },
        fetchProductsFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        fetchFeaturedProductsSuccess: (state, action: PayloadAction<Product[]>) => {
            state.featuredProducts = action.payload;
        },
        fetchTrendingProductsSuccess: (state, action: PayloadAction<Product[]>) => {
            state.trendingProducts = action.payload;
        },
        selectProduct: (state, action: PayloadAction<number>) => {
            state.selectedProduct = state.products.find(p => p.id === action.payload) || null;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
    },
});

export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    fetchFeaturedProductsSuccess,
    fetchTrendingProductsSuccess,
    selectProduct,
    setCurrentPage,
    clearSelectedProduct,
} = productSlice.actions;

export default productSlice.reducer;
