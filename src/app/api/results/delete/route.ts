import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { validateCUETEmail } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { email, semester } = await request.json();

    if (!email || !validateCUETEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email' },
        { status: 400 }
      );
    }

    if (!semester) {
      return NextResponse.json(
        { message: 'Semester is required' },
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
    
    const semesterIndex = user.semesterResults.findIndex(
      (result: any) => result.semester === semester
    );

    if (semesterIndex === -1) {
      return NextResponse.json(
        { message: 'Semester not found' },
        { status: 404 }
      );
    }

    user.semesterResults.splice(semesterIndex, 1);
    
    user.calculateOverallCGPA();
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Semester results deleted successfully',
      overallCGPA: user.overallCGPA,
      totalCredits: user.totalCredits
    });
  } catch (error) {
    console.error('Delete semester error:', error);
    return NextResponse.json(
      { message: 'Failed to delete semester results' },
      { status: 500 }
    );
  }
}