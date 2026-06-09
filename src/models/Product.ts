import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductVariant {
  size: string;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  categorySlug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  metal: "gold" | "silver" | "rose-gold" | "oxidised" | "multi";
  metalColour: "yellow" | "white" | "rose" | "oxidised" | "multi";
  material: string;
  variants: IProductVariant[];
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  weight?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    categorySlug: { type: String, required: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    metal: {
      type: String,
      enum: ["gold", "silver", "rose-gold", "oxidised", "multi"],
      required: true,
    },
    metalColour: {
      type: String,
      enum: ["yellow", "white", "rose", "oxidised", "multi"],
      required: true,
    },
    material: { type: String, default: "" },
    variants: [ProductVariantSchema],
    stock: { type: Number, required: true, min: 0, default: 0 },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String, lowercase: true }],
    weight: { type: Number },
  },
  { timestamps: true }
);

ProductSchema.index({ categorySlug: 1, isPublished: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ tags: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
