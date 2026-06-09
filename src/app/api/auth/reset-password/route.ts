import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyOTP } from "@/lib/auth/otp";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { identifier, otp, newPassword } = await req.json() as {
      identifier?: string;
      otp?: string;
      newPassword?: string;
    };

    if (!identifier || !otp || !newPassword) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const valid = await verifyOTP(identifier, otp, "reset");
    if (!valid) {
      return NextResponse.json({ message: "Invalid or expired OTP." }, { status: 400 });
    }

    await connectDB();

    const hashed = await bcrypt.hash(newPassword, 12);

    const user = await User.findOneAndUpdate(
      identifier.includes("@") ? { email: identifier.toLowerCase() } : { phone: identifier },
      { password: hashed },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "Account not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("[/api/auth/reset-password]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
