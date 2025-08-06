import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { validateCUETEmail } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp || !validateCUETEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email or OTP' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.otp || !user.otpExpires) {
      return NextResponse.json(
        { message: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    if (user.otpExpires < new Date()) {
      return NextResponse.json(
        { message: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }
    
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    return NextResponse.json({
      message: 'Login successful',
      success: true,
      user: {
        email: user.email,
        studentId: user.studentId,
        year: user.year,
        department: user.department,
        rollNumber: user.rollNumber,
        name: user.name,
        overallCGPA: user.overallCGPA,
        totalCredits: user.totalCredits,
        targetCGPA: user.targetCGPA,
        totalSemesters: user.totalSemesters,
      },
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { message: 'Failed to verify code' },
      { status: 500 }
    );
  }
}