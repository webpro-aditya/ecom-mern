// src/store/useStore.js (using Zustand)
const useStore = create((set, get) => ({
  // Cart state
  cart: [],
  addToCart: (item) => set((state) => ({
    cart: [...state.cart, item]
  })),
  
  // Product state
  products: [],
  setProducts: (products) => set({ products }),
  
  // Loading states
  loading: false,
  setLoading: (loading) => set({ loading })
}))
