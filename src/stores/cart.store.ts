import { create } from "zustand";

export interface CartItem {
  _id: string;
  productSlug: string;
  categorySlug: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  giftWrap: boolean;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  giftWrap: number;
  shipping: number;
  total: number;
}

interface CartState {
  items: CartItem[];
  totals: CartTotals;
  drawerOpen: boolean;
  loading: boolean;
  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  setCart: (items: CartItem[], totals: CartTotals) => void;
  fetchCart: () => Promise<void>;
  addItem: (payload: Omit<CartItem, "_id"> & { productId: string }) => Promise<void>;
  updateQty: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

const EMPTY_TOTALS: CartTotals = { subtotal: 0, giftWrap: 0, shipping: 0, total: 0 };

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totals: EMPTY_TOTALS,
  drawerOpen: false,
  loading: false,

  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  setCart: (items, totals) => set({ items, totals }),

  fetchCart: async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      set({ items: data.items ?? [], totals: data.totals ?? EMPTY_TOTALS });
    } catch {
      // silent
    }
  },

  addItem: async (payload) => {
    set({ loading: true });
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        set({ items: data.items, totals: data.totals, drawerOpen: true });
      }
    } finally {
      set({ loading: false });
    }
  },

  updateQty: async (itemId, quantity) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (res.ok) set({ items: data.items, totals: data.totals });
    } catch {
      // silent
    }
  },

  removeItem: async (itemId) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) set({ items: data.items, totals: data.totals });
    } catch {
      // silent
    }
  },
}));
