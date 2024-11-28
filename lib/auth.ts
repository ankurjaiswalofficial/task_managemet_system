import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { LoginInput } from "./validations/auth";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "your-secret-key");

export async function encrypt(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function compare(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function createToken(email: string, userId: number) {
  return await new SignJWT({ email, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as { email: string; userId: number };
  } catch (err) {
    return null;
  }
}

export async function getSession() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function validateRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) return null;
  const valid = await compare(data.password, user.password);
  if (!valid) {
    return { message: "Invalid password" };
  }

  return user;
}
