import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { OTP } from "@/models/OTP";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOTP(
  identifier: string,
  type: "verify" | "reset"
): Promise<string> {
  await connectDB();
  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 8);

  // Invalidate any existing OTPs for this identifier + type
  await OTP.deleteMany({ identifier, type });

  await OTP.create({
    identifier,
    otpHash,
    type,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  // In dev: log to console so you can test without SMS/email configured
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n[DEV OTP] ${identifier} → ${otp}\n`);
  }

  return otp;
}

export async function verifyOTP(
  identifier: string,
  otp: string,
  type: "verify" | "reset"
): Promise<boolean> {
  await connectDB();
  const record = await OTP.findOne({
    identifier,
    type,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!record) return false;

  const match = await bcrypt.compare(otp, record.otpHash);
  if (!match) return false;

  record.used = true;
  await record.save();
  return true;
}
