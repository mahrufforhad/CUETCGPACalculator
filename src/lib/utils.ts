import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { GRADE_SYSTEM } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Course {
  credit: number | string;
  grade: keyof typeof GRADE_SYSTEM;
}

export interface CGPACalculationResult {
  cgpa: number;
  totalCredits: number;
  totalGradePoints: number;
  validCourseCount: number;
}

export function calculateSemesterCGPA(courses: Course[]): CGPACalculationResult {
  const validCourses = courses.filter(course => {
    const credit = typeof course.credit === 'string' ? parseFloat(course.credit) : course.credit;
    return !isNaN(credit) && credit > 0 && GRADE_SYSTEM[course.grade];
  });
  
  const totalCredits = validCourses.reduce((sum, course) => {
    const credit = typeof course.credit === 'string' ? parseFloat(course.credit) : course.credit;
    return sum + credit;
  }, 0);
  
  const totalGradePoints = validCourses.reduce((sum, course) => {
    const credit = typeof course.credit === 'string' ? parseFloat(course.credit) : course.credit;
    return sum + (credit * GRADE_SYSTEM[course.grade].point);
  }, 0);
  
  const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
  
  return {
    cgpa,
    totalCredits,
    totalGradePoints,
    validCourseCount: validCourses.length
  };
}

export function calculateOverallCGPA(semesters: Array<{courses: Course[]}>): CGPACalculationResult {
  const allCourses = semesters.flatMap(semester => semester.courses);
  return calculateSemesterCGPA(allCourses);
}

/**
 * Truncates a number to 2 decimal places without rounding
 * Example: 2.6666666 -> "2.66" (not "2.67")
 */
export function formatCGPA(cgpa: number): string {
  const truncated = Math.floor(cgpa * 100) / 100;
  return truncated.toFixed(2);
}