import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { validateCUETEmail } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { email, name, targetCGPA, totalSemesters } = await request.json();

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
    
    if (name !== undefined) user.name = name;
    if (targetCGPA !== undefined && targetCGPA !== null) {
      if (targetCGPA < 0 || targetCGPA > 4.0) {
        return NextResponse.json(
          { message: 'Target CGPA must be between 0 and 4.0' },
          { status: 400 }
        );
      }
      user.targetCGPA = targetCGPA;
    }
    if (totalSemesters !== undefined) {
      if (totalSemesters < 1 || totalSemesters > 12) {
        return NextResponse.json(
          { message: 'Total semesters must be between 1 and 12' },
          { status: 400 }
        );
      }
      user.totalSemesters = totalSemesters;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
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
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}