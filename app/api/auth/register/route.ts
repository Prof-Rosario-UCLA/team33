import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { rateLimit, sanitizeInput, isValidEmail, validatePassword, isSecureOrigin } from '../../../lib/security';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Security checks
    if (!isSecureOrigin(req)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    // Rate limiting: 5 registration attempts per 15 minutes per IP
    if (!rateLimit(req, 5, 15 * 60 * 1000)) {
      return NextResponse.json({ 
        error: 'Too many registration attempts. Please try again later.' 
      }, { status: 429 });
    }

    const body = await req.json();
    const { email, password } = body;

    // Input validation
  if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({ 
        error: 'Please provide a valid email address' 
      }, { status: 400 });
  }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json({ 
        error: passwordValidation.message 
      }, { status: 400 });
    }

    // Check if user already exists (using Prisma's parameterized queries)
    const existingUser = await prisma.user.findUnique({ 
      where: { email: sanitizedEmail } 
    });
    
    if (existingUser) {
      return NextResponse.json({ 
        error: 'An account with this email already exists' 
      }, { status: 409 });
  }

    // Hash password with higher cost factor for better security
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with Prisma (parameterized query prevents SQL injection)
    const user = await prisma.user.create({ 
      data: { 
        email: sanitizedEmail, 
        password: hashedPassword 
      },
      select: {
        id: true,
        email: true,
        // Don't return password hash
      }
    });

    return NextResponse.json({ 
      message: 'Account created successfully',
      user: { id: user.id, email: user.email }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Internal server error. Please try again later.' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 