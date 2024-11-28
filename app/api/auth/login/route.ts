import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  comparePasswords, 
  generateToken,
  hashPassword 
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    let user = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user) {
      const hashedPassword = await hashPassword(password);

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword
        }
      });
    } else {
      const isPasswordValid = await comparePasswords(
        password, 
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' }, 
          { status: 401 }
        );
      }
    }

    const token = generateToken(user.id, user.email);

    const response = NextResponse.json({ 
      token,
      user: { 
        id: user.id, 
        email: user.email 
      },
      isNewUser: !user.id
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.error('Login/Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' }, 
      { status: 500 }
    );
  }
}
