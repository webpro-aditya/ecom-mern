import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from ".";

type CartItem = {
  key: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
  variantKey?: string;
  attributes?: Record<string, string>;
  variationId?: string;
};

type CartState = {
  items: CartItem[];
};

function loadInitial(): CartState {
  try {
    const raw = localStorage.getItem("cart");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { items: [] };
}

function persist(state: CartState) {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch {}
}

const initialState: CartState = loadInitial();

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, "key" | "qty"> & { qty?: number }>) => {
      const qty = action.payload.qty ?? 1;
      const key = `${action.payload.productId}:${action.payload.variantKey || action.payload.variationId || "_"}`;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        existing.qty += qty;
        existing.price = action.payload.price;
      } else {
        state.items.push({
          key,
          productId: action.payload.productId,
          name: action.payload.name,
          price: action.payload.price,
          image: action.payload.image,
          qty,
          variantKey: action.payload.variantKey,
          attributes: action.payload.attributes,
          variationId: action.payload.variationId,
        });
      }
      persist(state);
    },
    updateQty: (state, action: PayloadAction<{ key: string; qty: number }>) => {
      const it = state.items.find((i) => i.key === action.payload.key);
      if (it) {
        it.qty = Math.max(1, action.payload.qty);
        persist(state);
      }
    },
    removeItem: (state, action: PayloadAction<{ key: string }>) => {
      state.items = state.items.filter((i) => i.key !== action.payload.key);
      persist(state);
    },
    clear: (state) => {
      state.items = [];
      persist(state);
    },
  },
});

export const { addItem, updateQty, removeItem, clear } = cartSlice.actions;
export default cartSlice.reducer;

// Sync cart with backend for logged-in users
export const syncCartToServer = createAsyncThunk(
  "cart/sync",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const items = state.cart.items || [];
    const base = import.meta.env.PROD ? `${window.location.origin}/api/` : `${import.meta.env.VITE_API_URL}`;
    const url = `${base}user/cart/create`;

    // Attempt to read CSRF for cookie-protected endpoints; also support Bearer token if set
    const csrfMatch = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
    const csrfToken = csrfMatch ? decodeURIComponent(csrfMatch[1]) : "";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

    // If your login endpoint returns an auth token, place it in userSlice.token to include here
    const bearer = state.user.token;
    if (bearer) headers["Authorization"] = `Bearer ${bearer}`;

    for (const it of items) {
      const payload: any = { productId: it.productId, quantity: it.qty };
      if (it.variationId) payload.variationId = it.variationId;
      try {
        await fetch(url, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } catch (_) {}
    }
    return true;
  }
);