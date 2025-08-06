import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { validateCUETEmail, extractInfoFromEmail } from '@/lib/constants';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !validateCUETEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid CUET student email format' },
        { status: 400 }
      );
    }

    await dbConnect();

    const emailInfo = extractInfoFromEmail(email);
    if (!emailInfo) {
      return NextResponse.json(
        { message: 'Unable to extract information from email' },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ email });
    
    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      const studentId = email.split('@')[0];
      user = new User({
        email,
        studentId,
        year: emailInfo.year,
        departmentCode: emailInfo.departmentCode,
        department: emailInfo.department,
        rollNumber: emailInfo.rollNumber,
        otp,
        otpExpires,
        isVerified: false,
      });
      await user.save();
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'CUET CGPA Calculator - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">CUET CGPA Calculator</h2>
          <p>Hello,</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; margin: 0; color: #1f2937; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Student Info:<br>
            Year: ${emailInfo.year}<br>
            Department: ${emailInfo.department}<br>
            Roll: ${emailInfo.rollNumber}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: 'Verification code sent successfully',
      success: true,
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { message: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}