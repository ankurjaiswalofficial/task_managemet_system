import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET ?? "your-secret-key";

export async function middleware(req: NextRequest) {
  let token = req.headers.get("Authorization")?.split("Bearer ")[1];
  if (!token) token = req.cookies.get("token")?.value ?? (await req.json())?.token;
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*"],
};
