import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    const payload = verifyAccessToken(token);
    await connectDB();
    const user = await User.findById(payload.userId).select("-password").lean();
    if (!user) return NextResponse.json({ user: null }, { status: 401 });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyAccessToken(token);
    const { name } = await req.json() as { name?: string };
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    await connectDB();
    const user = await User.findByIdAndUpdate(
      payload.userId,
      { name: name.trim() },
      { new: true }
    ).select("-password").lean();

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
