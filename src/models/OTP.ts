import mongoose, { Document, Schema } from "mongoose";

export interface IOTP extends Document {
  identifier: string; // email or phone
  otpHash: string;
  type: "verify" | "reset";
  expiresAt: Date;
  used: boolean;
}

const OTPSchema = new Schema<IOTP>({
  identifier: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  type: { type: String, enum: ["verify", "reset"], required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

// Auto-delete expired documents
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.models.OTP ?? mongoose.model<IOTP>("OTP", OTPSchema);
