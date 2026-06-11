import { API_URL } from './config';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  products: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ products: Product[]; total: number; pages: number }>(`/products${qs}`);
    },
    get: (slug: string) => request<{ product: Product }>(`/products/${slug}`),
  },
  categories: {
    list: () => request<{ categories: Category[] }>('/categories'),
    get:  (slug: string) => request<{ category: Category }>(`/categories/${slug}`),
  },
  auth: {
    login:    (data: { email: string; password: string }) =>
      request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: { name: string; email: string; password: string }) =>
      request<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: (token: string) =>
      request<{ user: User }>('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
  },
  cart: {
    get:    (guestId: string) => request<{ cart: CartItem[] }>('/cart', { headers: { 'x-guest-id': guestId } }),
    add:    (guestId: string, item: Partial<CartItem>) =>
      request<{ cart: CartItem[] }>('/cart/add', { method: 'POST', body: JSON.stringify(item), headers: { 'x-guest-id': guestId } }),
    update: (guestId: string, productId: string, quantity: number) =>
      request<{ cart: CartItem[] }>('/cart/update', { method: 'PUT', body: JSON.stringify({ productId, quantity }), headers: { 'x-guest-id': guestId } }),
    remove: (guestId: string, productId: string) =>
      request<{ cart: CartItem[] }>(`/cart/remove/${productId}`, { method: 'DELETE', headers: { 'x-guest-id': guestId } }),
  },
  orders: {
    create: (data: Partial<Order>, token?: string) =>
      request<{ order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    mine: (token: string) =>
      request<{ orders: Order[] }>('/orders/my', { headers: { Authorization: `Bearer ${token}` } }),
  },
};

// Types
export interface Product {
  _id: string; name: string; slug: string; categorySlug: string;
  price: number; discountPrice?: number; images: string[];
  metal: string; isFeatured: boolean; isBestseller: boolean; isNewIn: boolean;
  description?: string; tags?: string[]; stock: number;
}
export interface Category {
  _id: string; name: string; slug: string; description?: string; tagline?: string; bannerImage?: string;
}
export interface CartItem {
  productId: string; name: string; image: string; price: number; quantity: number; giftWrap: boolean;
}
export interface Order { _id: string; items: CartItem[]; total: number; status: string; createdAt: string; }
export interface User  { id: string; name: string; email: string; role: string; }
