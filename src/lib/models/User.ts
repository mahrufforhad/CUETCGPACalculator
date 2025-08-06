import mongoose, { Document, Schema } from 'mongoose';
import { GRADE_SYSTEM } from '../constants';

export interface ICourse {
  courseCode: string;
  credit: number;
  grade: keyof typeof GRADE_SYSTEM;
  sessional: boolean;
  courseType: 'regular' | 'retake' | 'improvement';
}

export interface ISemesterResult {
  semester: string;
  courses: ICourse[];
  cgpa: number;
  totalCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  email: string;
  studentId: string;
  year: string;
  departmentCode: string;
  department: string;
  rollNumber: string;
  name?: string;
  semesterResults: ISemesterResult[];
  overallCGPA: number;
  totalCredits: number;
  targetCGPA?: number;
  totalSemesters: number;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  courseCode: { type: String, required: true },
  credit: { type: Number, required: true },
  grade: { 
    type: String, 
    required: true,
    enum: Object.keys(GRADE_SYSTEM)
  },
  sessional: { type: Boolean, default: false },
  courseType: { 
    type: String, 
    enum: ['regular', 'retake', 'improvement'],
    default: 'regular'
  }
});

const SemesterResultSchema = new Schema<ISemesterResult>({
  semester: { type: String, required: true },
  courses: [CourseSchema],
  cgpa: { type: Number, required: true },
  totalCredits: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^u\d{2}(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15)\d{3}@student\.cuet\.ac\.bd$/
  },
  studentId: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  departmentCode: { type: String, required: true },
  department: { type: String, required: true },
  rollNumber: { type: String, required: true },
  name: { type: String },
  semesterResults: [SemesterResultSchema],
  overallCGPA: { type: Number, default: 0 },
  totalCredits: { type: Number, default: 0 },
  targetCGPA: { type: Number, min: 0, max: 4.0 },
  totalSemesters: { type: Number, default: 8 },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

UserSchema.methods.calculateOverallCGPA = function() {
  if (this.semesterResults.length === 0) {
    this.overallCGPA = 0;
    this.totalCredits = 0;
    return;
  }

  let totalGradePoints = 0;
  let totalCredits = 0;

  this.semesterResults.forEach((semester: ISemesterResult) => {
    semester.courses.forEach((course: ICourse) => {
      totalCredits += course.credit;
      totalGradePoints += course.credit * GRADE_SYSTEM[course.grade].point;
    });
  });

  this.overallCGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  this.totalCredits = totalCredits;
};

UserSchema.methods.calculateRequiredCGPA = function() {
  if (!this.targetCGPA || this.semesterResults.length >= this.totalSemesters) {
    return null;
  }

  const completedSemesters = this.semesterResults.length;
  const remainingSemesters = this.totalSemesters - completedSemesters;
  
  const averageCreditsPerSemester = this.totalCredits > 0 ? this.totalCredits / completedSemesters : 20;
  const estimatedRemainingCredits = remainingSemesters * averageCreditsPerSemester;
  const totalEstimatedCredits = this.totalCredits + estimatedRemainingCredits;
  
  const currentGradePoints = this.totalCredits * this.overallCGPA;
  const requiredTotalGradePoints = totalEstimatedCredits * this.targetCGPA;
  const requiredRemainingGradePoints = requiredTotalGradePoints - currentGradePoints;
  
  const requiredCGPAForRemaining = estimatedRemainingCredits > 0 ? 
    requiredRemainingGradePoints / estimatedRemainingCredits : 0;

  return {
    requiredCGPA: Math.max(0, Math.min(4.0, requiredCGPAForRemaining)),
    remainingSemesters,
    estimatedRemainingCredits,
    isAchievable: requiredCGPAForRemaining <= 4.0 && requiredCGPAForRemaining >= 0
  };
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);