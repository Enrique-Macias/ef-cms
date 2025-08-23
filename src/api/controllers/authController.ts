import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { logUserAction, auditActions, auditResources } from '@/lib/audit';
import { userCreateSchema, userLoginSchema, passwordResetRequestSchema, passwordResetSchema } from '@/lib/validations';
import { z } from 'zod';

export const register = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = userCreateSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        passwordHash,
        role: validatedData.role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      }
    });

    // Log the action
    await logUserAction(
      user.id,
      auditActions.CREATE,
      auditResources.USERS,
      { user: user }
    );

    // Send welcome email
    const loginLink = `${process.env.FRONTEND_URL}/login`;
    await sendEmail(user.email, 'welcome', {
      userName: user.fullName,
      loginLink,
    });

    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = userLoginSchema.parse(req.body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await comparePassword(validatedData.password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    
    // Create refresh token record
    const refreshTokenRecord = await prisma.usedToken.create({
      data: {
        userId: user.id,
        token: 'temp', // Will be updated with actual token
      }
    });

    const refreshToken = generateRefreshToken(user.id, refreshTokenRecord.id);
    
    // Update the refresh token record with the actual token
    await prisma.usedToken.update({
      where: { id: refreshTokenRecord.id },
      data: { token: refreshToken }
    });

    // Log the login
    await logUserAction(
      user.id,
      auditActions.LOGIN,
      auditResources.USERS,
      { timestamp: new Date().toISOString() }
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      // Invalidate refresh token by marking it as used
      await prisma.usedToken.updateMany({
        where: { token: refreshToken },
        data: { usedAt: new Date() }
      });
    }

    // Clear cookie
    res.clearCookie('refreshToken');
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = passwordResetRequestSchema.parse(req.body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
    }

    // Create password reset token
    const resetToken = await prisma.usedToken.create({
      data: {
        userId: user.id,
        token: 'temp', // Will be updated
      }
    });

    // Generate actual token
    const actualToken = generateRefreshToken(user.id, resetToken.id);
    
    // Update token record
    await prisma.usedToken.update({
      where: { id: resetToken.id },
      data: { token: actualToken }
    });

    // Send password reset email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${actualToken}`;
    await sendEmail(user.email, 'passwordReset', {
      resetLink,
      userName: user.fullName,
    });

    res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = passwordResetSchema.parse(req.body);
    
    // Find and validate token
    const tokenRecord = await prisma.usedToken.findFirst({
      where: {
        token: validatedData.token,
        usedAt: undefined // Token not used yet
      }
    });

    if (!tokenRecord) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash new password
    const passwordHash = await hashPassword(validatedData.newPassword);

    // Update user password using the userId from the token record
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { passwordHash }
    });

    // Mark token as used
    await prisma.usedToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() }
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
