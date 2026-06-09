import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/auth/otp";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const { identifier, otp } = await req.json() as {
      identifier?: string;
      otp?: string;
    };

    if (!identifier || !otp) {
      return NextResponse.json({ message: "Identifier and OTP required." }, { status: 400 });
    }

    const valid = await verifyOTP(identifier, otp, "verify");
    if (!valid) {
      return NextResponse.json({ message: "Invalid or expired OTP." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      identifier.includes("@") ? { email: identifier } : { phone: identifier },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const payload = {
      userId: user._id.toString(),
      ...(user.email ? { email: user.email } : { phone: user.phone }),
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const res = NextResponse.json({ message: "Verified successfully." });

    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });
    res.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("[/api/auth/otp/verify]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
