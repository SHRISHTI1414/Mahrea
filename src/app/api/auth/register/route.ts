import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.replace(/\s+/g, ""));
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

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const isEmailInput = isEmail(emailOrPhone);
    const isPhoneInput = isPhone(emailOrPhone);

    if (!isEmailInput && !isPhoneInput) {
      return NextResponse.json(
        { message: "Enter a valid email address or 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    await connectDB();

    // Check duplicate
    const existing = await User.findOne(
      isEmailInput ? { email: emailOrPhone.toLowerCase() } : { phone: emailOrPhone }
    );
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email/phone already exists." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      ...(isEmailInput
        ? { email: emailOrPhone.toLowerCase() }
        : { phone: emailOrPhone }),
      password: hashed,
      provider: "local",
    });

    const payload = {
      userId: user._id.toString(),
      ...(isEmailInput ? { email: user.email } : { phone: user.phone }),
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const res = NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 }
    );

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
    console.error("[/api/auth/register]", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
