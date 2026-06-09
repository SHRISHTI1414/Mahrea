/**
 * Run with: npx tsx src/scripts/seed.ts
 */
import mongoose from "mongoose";
import Category from "../models/Category";
import Product from "../models/Product";

const MONGO_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/mahrea";

const CATEGORIES = [
  { name: "Rings", slug: "rings", description: "From minimalist bands to statement cocktail rings", heroTagline: "Stack 'em, wear 'em, love 'em", sortOrder: 1 },
  { name: "Earrings", slug: "earrings", description: "Studs, hoops, drops and dangles for every mood", heroTagline: "Frame your face with something beautiful", sortOrder: 2 },
  { name: "Necklaces", slug: "necklaces", description: "Layering chains, pendants and statement pieces", heroTagline: "Every neckline deserves a story", sortOrder: 3 },
  { name: "Bracelets", slug: "bracelets", description: "Delicate chains, cuffs and charm bracelets", heroTagline: "Layer up, stack higher", sortOrder: 4 },
  { name: "Anklets", slug: "anklets", description: "Dainty and bold anklets for everyday wear", heroTagline: "Adorn every step", sortOrder: 5 },
  { name: "Sets", slug: "sets", description: "Matching jewellery sets curated to complete your look", heroTagline: "The complete look, effortlessly", sortOrder: 6 },
];

function makeProducts(categoryId: mongoose.Types.ObjectId, categorySlug: string) {
  const metals = ["gold", "silver", "rose-gold"] as const;
  const colours = ["yellow", "white", "rose"] as const;
  const names: Record<string, string[]> = {
    rings: ["Aurora Stackable Ring", "Celestial Solitaire", "Vintage Pearl Band", "Twisted Gold Ring", "Crystal Bloom Ring", "Minimalist Wire Ring", "Floral Band Ring", "Emerald Stone Ring", "Infinity Twist Ring", "Moonstone Ring", "Textured Dome Ring", "Geometric Cutout Ring"],
    earrings: ["Luna Drop Earrings", "Hoop of Stars", "Pearl Stud Earrings", "Oxidised Jhumka", "Crystal Chandelier", "Gold Bar Studs", "Floral Drop Earrings", "Twisted Hoop Earrings", "Teardrop Crystal", "Minimalist Ear Cuff", "Bead Cluster Drops", "Tassel Earrings"],
    necklaces: ["Layered Gold Chain", "Pearl Pendant Necklace", "Crystal Statement Piece", "Minimalist Bar Necklace", "Floral Choker", "Charm Necklace", "Zodiac Pendant", "Rose Quartz Necklace", "Tennis Chain", "Coin Necklace", "Lariat Drop Chain", "Evil Eye Pendant"],
    bracelets: ["Delicate Chain Bracelet", "Crystal Bangle", "Charm Bracelet", "Twisted Cuff", "Pearl Bracelet", "Gold Bangle Set", "Minimalist Band", "Beaded Bracelet", "Heart Charm Bracelet", "Rose Gold Cuff", "Evil Eye Bracelet", "Stack Bangles"],
    anklets: ["Dainty Chain Anklet", "Beaded Anklet", "Heart Charm Anklet", "Gold Bell Anklet", "Oxidised Silver Anklet", "Crystal Anklet", "Layered Anklet", "Minimalist Anklet", "Lotus Charm Anklet", "Moon Anklet", "Star Anklet", "Shell Anklet"],
    sets: ["Bridal Pearl Set", "Crystal Party Set", "Minimalist Gold Set", "Floral Silver Set", "Oxidised Ethnic Set", "Rose Quartz Set", "Emerald Polki Set", "Everyday Casual Set", "Statement Evening Set", "Layered Boho Set", "Classic Diamond Set", "Kundan Bridal Set"],
  };

  const productNames = names[categorySlug] ?? names.rings;
  const prices = [199, 299, 349, 399, 449, 499, 549, 599, 699, 799, 899, 999];

  return productNames.map((name, i) => {
    const metal = metals[i % metals.length];
    const colour = colours[i % colours.length];
    const price = prices[i % prices.length];
    const discountPrice = i % 3 === 0 ? Math.round(price * 0.8) : undefined;
    return {
      name,
      slug: `${categorySlug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${i + 1}`,
      description: `Beautiful handcrafted ${name.toLowerCase()} made with premium quality materials. Perfect for everyday wear or special occasions.`,
      category: categoryId,
      categorySlug,
      price,
      discountPrice,
      images: [],
      metal,
      metalColour: colour,
      material: metal === "gold" ? "Gold Plated Brass" : metal === "silver" ? "Sterling Silver" : "Rose Gold Plated Brass",
      variants: categorySlug === "rings" || categorySlug === "bracelets" || categorySlug === "anklets"
        ? [{ size: "XS", stock: 5 }, { size: "S", stock: 8 }, { size: "M", stock: 10 }, { size: "L", stock: 6 }]
        : [],
      stock: 10 + (i * 3),
      isPublished: true,
      isFeatured: i < 3,
      tags: [categorySlug, metal, colour, price <= 299 ? "budget" : price >= 799 ? "premium" : "mid-range"],
    };
  });
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  await Category.deleteMany({});
  await Product.deleteMany({});
  console.log("Cleared existing data");

  const createdCategories = await Category.insertMany(CATEGORIES);
  console.log(`Seeded ${createdCategories.length} categories`);

  const allProducts = createdCategories.flatMap((cat) =>
    makeProducts(cat._id as mongoose.Types.ObjectId, cat.slug)
  );
  await Product.insertMany(allProducts);
  console.log(`Seeded ${allProducts.length} products`);

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch((err) => { console.error(err); process.exit(1); });
