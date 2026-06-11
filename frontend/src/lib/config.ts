// ─── Site-wide configuration ─────────────────────────────────────────────────
// Edit this file to change text, colors, nav links, and categories site-wide.

export const SITE = {
  name: 'Mahrea',
  tagline: 'Sparkle Everyday',
  description: 'Anti-tarnish fine jewellery designed for the everyday you, inspired by our roots.',
};

export const COLORS = {
  maroon:     '#6b1040',
  maroonDark: '#3a0820',
  gold:       '#c5962a',
  cream:      '#fdf4ee',
  creamDark:  '#f5ece0',
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const NAV_LINKS = [
  { label: 'New In',              href: '/new-in' },
  { label: 'Trending',            href: '/trending' },
  { label: 'Indian Ethnic',       href: '/category/indian-ethnic' },
  { label: 'Gifts & Wedding Lite',href: '/gifts' },
];

export const CATEGORIES = [
  { label: 'Earrings',              slug: 'earrings',        banner: '/images/banner-earrings.jpg',       tagline: 'From subtle to statement, find earrings that speak your style.' },
  { label: 'Bracelets',             slug: 'bracelets',       banner: '/images/banner-bracelets.jpg',      tagline: 'Layer them, wear them solo or stack your story. Timeless pieces for every moment.' },
  { label: 'Pendants',              slug: 'pendants',        banner: '/images/banner-pendants.jpg',       tagline: 'Little pieces, big meaning. Pendants that stay close to your story.' },
  { label: 'Anklets',               slug: 'anklets',         banner: '/images/banner-anklets.jpg',        tagline: 'Grace in every step. Anklets that bring tradition to your today.' },
  { label: 'Indian Ethnic Jewellery', slug: 'indian-ethnic', banner: '/images/banner-indian-ethnic.jpg',  tagline: 'Timeless heritage, intricate craftsmanship. Jewellery that celebrates every tradition.' },
  { label: 'Rings',                 slug: 'rings',           banner: '/images/banner-earrings.jpg',       tagline: 'Rings that tell your story — from everyday wear to special occasions.' },
];
