import { NextRequest, NextResponse } from "next/server";
import { createOTP } from "@/lib/auth/otp";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json() as { identifier?: string };

    if (!identifier) {
      return NextResponse.json({ message: "Email or phone required." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne(
      identifier.includes("@") ? { email: identifier.toLowerCase() } : { phone: identifier }
    );

    // Don't reveal whether account exists
    if (!user) {
      return NextResponse.json({ message: "OTP sent if account exists." });
    }

    if (user.provider !== "local") {
      return NextResponse.json(
        { message: "This account uses Google/Facebook login. Use that to sign in." },
        { status: 400 }
      );
    }

    await createOTP(identifier, "reset");

    return NextResponse.json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("[/api/auth/forgot-password]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
