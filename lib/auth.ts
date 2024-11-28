import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(userId: number, email: string): string {
  const SECRET_KEY = process.env.JWT_SECRET ?? 'my_secret_key';
  return jwt.sign(
    { id: userId, email }, 
    SECRET_KEY, 
    { expiresIn: '24h' }
  );
}

export async function validateToken(token: string): Promise<{ id: number, email: string } | null> {
  try {
    const SECRET_KEY = process.env.JWT_SECRET ?? 'your_default_secret_key';
    return jwt.verify(token, SECRET_KEY) as { id: number, email: string };
  } catch {
    return null;
  }
}

export async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }

  const decoded = await validateToken(token);
  
  if (!decoded) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: decoded.id },
    select: { 
      id: true, 
      email: true 
    }
  });
}
