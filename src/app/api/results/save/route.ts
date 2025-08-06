import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { validateCUETEmail } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { email, semester, courses, cgpa, totalCredits } = await request.json();

    if (!email || !validateCUETEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email' },
        { status: 400 }
      );
    }

    if (!semester || !courses) {
      return NextResponse.json(
        { message: 'Missing required data' },
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
    
    const existingSemesterIndex = user.semesterResults.findIndex(
      (result: any) => result.semester === semester
    );

    const semesterResult = {
      semester,
      courses,
      cgpa,
      totalCredits,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (existingSemesterIndex !== -1) {
      user.semesterResults[existingSemesterIndex] = semesterResult;
    } else {
      user.semesterResults.push(semesterResult);
    }
    
    user.calculateOverallCGPA();
    await user.save();

    return NextResponse.json({
      message: 'Results saved successfully',
      success: true,
      overallCGPA: user.overallCGPA,
      totalCredits: user.totalCredits
    });

  } catch (error) {
    console.error('Save results error:', error);
    return NextResponse.json(
      { message: 'Failed to save results' },
      { status: 500 }
    );
  }
}