import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { validateCUETEmail } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !validateCUETEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email' },
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

    return NextResponse.json({
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
        semesterResults: user.semesterResults
      },
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}