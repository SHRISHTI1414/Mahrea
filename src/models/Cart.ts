import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  productSlug: string;
  categorySlug: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  giftWrap: boolean;
  quantity: number;
}

export interface ICart extends Document {
  userId?: mongoose.Types.ObjectId;
  guestId?: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productSlug: { type: String, required: true },
    categorySlug: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true },
    size: { type: String },
    giftWrap: { type: Boolean, default: false },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: true }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", sparse: true },
    guestId: { type: String, sparse: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

CartSchema.index({ userId: 1 });
CartSchema.index({ guestId: 1 });

const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
