import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: { token?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }

  const { token } = body;

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { success: false, message: "Token is required" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // 7 days — matches the backend's JWT cookie lifetime
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ success: true });
}
