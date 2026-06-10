import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  metal: string;
}

interface WishlistState {
  items: WishlistProduct[];
  toggle: (product: WishlistProduct) => void;
  isWishlisted: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some((i) => i._id === product._id);
        set({
          items: exists
            ? get().items.filter((i) => i._id !== product._id)
            : [...get().items, product],
        });
      },
      isWishlisted: (id) => get().items.some((i) => i._id === id),
    }),
    { name: "mahrea-wishlist" }
  )
);
