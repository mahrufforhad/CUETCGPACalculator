// Grade system and constants
export const GRADE_SYSTEM = {
  'A+': { point: 4.0, percentage: 80 },
  'A': { point: 3.75, percentage: 75 },
  'A-': { point: 3.5, percentage: 70 },
  'B+': { point: 3.25, percentage: 65 },
  'B': { point: 3.0, percentage: 60 },
  'B-': { point: 2.75, percentage: 55 },
  'C+': { point: 2.5, percentage: 50 },
  'C': { point: 2.25, percentage: 45 },
  'D': { point: 2.0, percentage: 40 },
  'F': { point: 0, percentage: 0 }
} as const;

export const DEPARTMENT_CODES = {
  '01': 'Civil Engineering',
  '02': 'Electrical & Electronic Engineering',
  '03': 'Mechanical Engineering',
  '04': 'Computer Science & Engineering',
  '05': 'Urban & Regional Planning',
  '06': 'Architecture',
  '07': 'Petroleum & Mining Engineering',
  '08': 'Electronics & Telecommunication Engineering',
  '09': 'Mechatronics & Industrial Engineering',
  '10': 'Water Resources Engineering',
  '11': 'Biomedical Engineering',
  '12': 'Materials and Metallurgical Engineering',
  '13': 'Nuclear Engineering'
} as const;

export const GRADE_OPTIONS = Object.keys(GRADE_SYSTEM) as Array<keyof typeof GRADE_SYSTEM>;

export const SEMESTER_OPTIONS = [
  'Level 1 - Term 1',
  'Level 1 - Term 2',
  'Level 2 - Term 1',
  'Level 2 - Term 2',
  'Level 3 - Term 1',
  'Level 3 - Term 2',
  'Level 4 - Term 1',
  'Level 4 - Term 2'
];

export const calculateCGPA = (courses: Array<{ credit: number | string; grade: keyof typeof GRADE_SYSTEM }>) => {
  const validCourses = courses.filter(course => {
    const credit = typeof course.credit === 'string' ? parseFloat(course.credit) : course.credit;
    return !isNaN(credit) && credit > 0;
  });
  
  const totalGradePoints = validCourses.reduce((sum, course) => {
    const credit = typeof course.credit === 'string' ? parseFloat(course.credit) : course.credit;
    return sum + (credit * GRADE_SYSTEM[course.grade].point);
  }, 0);
  
  const creditsForCGPA = validCourses.reduce((sum, course) => {
    const credit = typeof course.credit === 'string' ? parseFloat(course.credit) : course.credit;
    return course.grade === 'F' ? sum : sum + credit;
  }, 0);
  
  return creditsForCGPA > 0 ? (totalGradePoints / creditsForCGPA) : 0;
};

export const CUET_EMAIL_REGEX = /^u\d{2}(01|02|03|04|05|06|07|08|09|10|11|12|13)\d{3}@student\.cuet\.ac\.bd$/;

export const validateCUETEmail = (email: string) => {
  return CUET_EMAIL_REGEX.test(email);
};

export const extractInfoFromEmail = (email: string) => {
  const match = email.match(/^u(\d{2})(\d{2})(\d{3})@student\.cuet\.ac\.bd$/);
  if (match) {
    return {
      year: `20${match[1]}`,
      departmentCode: match[2],
      rollNumber: match[3],
      department: DEPARTMENT_CODES[match[2] as keyof typeof DEPARTMENT_CODES] || 'Unknown Department'
    };
  }
  return null;
};