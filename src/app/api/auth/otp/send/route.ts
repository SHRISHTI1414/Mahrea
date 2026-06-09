import { NextRequest, NextResponse } from "next/server";
import { createOTP } from "@/lib/auth/otp";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { identifier, type = "verify" } = await req.json() as {
      identifier?: string;
      type?: "verify" | "reset";
    };

    if (!identifier) {
      return NextResponse.json({ message: "Identifier required." }, { status: 400 });
    }

    await connectDB();

    if (type === "reset") {
      const user = await User.findOne(
        identifier.includes("@") ? { email: identifier } : { phone: identifier }
      );
      if (!user) {
        // Return success anyway to avoid user enumeration
        return NextResponse.json({ message: "OTP sent if account exists." });
      }
    }

    await createOTP(identifier, type);

    return NextResponse.json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("[/api/auth/otp/send]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
