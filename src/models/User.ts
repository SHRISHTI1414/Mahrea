import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email?: string;
  phone?: string;
  password?: string;
  name?: string;
  provider: "local" | "google" | "facebook";
  providerId?: string;
  isVerified: boolean;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },
    password: { type: String, select: false },
    name: { type: String, trim: true },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    providerId: { type: String },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true }
);

// Ensure at least email or phone is present
UserSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    next(new Error("Either email or phone number is required."));
  } else {
    next();
  }
});

export const User = mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);
