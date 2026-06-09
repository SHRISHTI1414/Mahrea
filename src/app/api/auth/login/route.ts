import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailOrPhone, password } = body as {
      emailOrPhone?: string;
      password?: string;
    };

    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { message: "Email/phone and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const isEmailInput = isEmail(emailOrPhone);

    // Fetch user with password field (excluded by default via select: false)
    const user = await User.findOne(
      isEmailInput
        ? { email: emailOrPhone.toLowerCase() }
        : { phone: emailOrPhone }
    ).select("+password");

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid email/phone or password." },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email/phone or password." },
        { status: 401 }
      );
    }

    const payload = {
      userId: user._id.toString(),
      ...(user.email ? { email: user.email } : { phone: user.phone }),
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const res = NextResponse.json({ message: "Logged in successfully." });

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
    console.error("[/api/auth/login]", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
