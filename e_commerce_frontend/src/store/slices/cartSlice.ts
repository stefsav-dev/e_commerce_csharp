import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
    totalQuantity: number;
}

const initialState: CartState = {
    items: [],
    totalAmount: 0,
    totalQuantity: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState, 
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.totalQuantity += action.payload.quantity;
            state.totalAmount += action.payload.price * action.payload.quantity;
        },
        removeItem: (state, action: PayloadAction<number>) => {
            const item = state.items.find(item => item.id === action.payload);
            if (item) {
                state.totalQuantity -= item.quantity;
                state.totalAmount -= item.price * item.quantity;
                state.items = state.items.filter(item => item.id !== action.payload);
            }
        },
        updateQuantity: (state, action: PayloadAction<{ id: number, quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                const quantityDiff = action.payload.quantity - item.quantity;
                item.quantity = action.payload.quantity;
                state.totalQuantity += quantityDiff;
                state.totalAmount += item.price * quantityDiff;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
        }
    }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
