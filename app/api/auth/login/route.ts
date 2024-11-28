import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken, login, encrypt } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    let user = await login(validatedData);
    if (user instanceof Error) {
      return NextResponse.json({ error: user.message }, { status: 400 });
    }
    if (!user) {
      const hashedPassword = await encrypt(validatedData.password);
      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
        },
      });
    }
    if ('message' in user) {
      return NextResponse.json({ error: user.message }, { status: 404 });
    }
    const token = await createToken(user.email, user.id);
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
