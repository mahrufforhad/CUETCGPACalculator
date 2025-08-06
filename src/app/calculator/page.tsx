'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GRADE_OPTIONS, GRADE_SYSTEM, SEMESTER_OPTIONS } from '@/lib/constants';
import { calculateSemesterCGPA, formatCGPA } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Course {
  courseCode: string;
  credit: number | string;
  grade: keyof typeof GRADE_SYSTEM;
  sessional: boolean;
  courseType: 'regular' | 'retake' | 'improvement';
}

export default function CalculatorPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'manual' | 'copypaste'>('manual');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course & { credit: string | number }>({
    courseCode: '',
    credit: '',
    grade: 'A+',
    sessional: false,
    courseType: 'regular'
  });
  const [copyPasteText, setCopyPasteText] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showInstructionDialog, setShowInstructionDialog] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUserData = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: "no-cache",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, []);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/login');
      return;
    }
    // Sync localStorage with cookie
    document.cookie = `userEmail=${email}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    setUserEmail(email);
    fetchUserData(email);
  }, [router, fetchUserData]);

  const loadSemesterData = (semester: string) => {
    if (!userData?.semesterResults) return;
    
    const existingSemester = userData.semesterResults.find(
      (result: any) => result.semester === semester
    );
    
    if (existingSemester) {
      setCourses([...existingSemester.courses]);
    } else {
      setCourses([]);
    }
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    if (semester) {
      loadSemesterData(semester);
    } else {
      setCourses([]);
    }
  };

  const addCourse = () => {
    if (!currentCourse.courseCode.trim()) {
      toast.error('Please enter a course code');
      return;
    }

    if (!currentCourse.credit || isNaN(Number(currentCourse.credit))) {
      toast.error('Please enter a valid credit');
      return;
    }

    const courseToAdd = { 
      ...currentCourse, 
      credit: Number(currentCourse.credit) 
    };

    setCourses([...courses, courseToAdd]);
    
    setCurrentCourse({
      courseCode: '',
      credit: '',
      grade: 'A+',
      sessional: false,
      courseType: 'regular'
    });
  };

  const removeCourse = (index: number) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
    
    setTimeout(() => {
      if (selectedSemester && userEmail) {
        autoSave(newCourses, false);
      }
    }, 50);
  };

  const updateCourseField = (index: number, field: keyof Course, value: any) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCourses(updatedCourses);
  };

  const currentCGPA = courses.length > 0 ? calculateSemesterCGPA(courses).cgpa : 0;

  const parseCopyPasteResult = () => {
    if (!copyPasteText.trim()) {
      toast.error('Please paste your result data');
      return;
    }

    try {
      const lines = copyPasteText.trim().split('\n');
      const parsedCourses: Course[] = [];

      for (let i = lines[0].includes("Course Code")? 1 : 0; i < lines.length; i++) {
        const parts = lines[i].split('\t').map(part => part.trim());
        
        if (parts.length >= 5) {
          const courseCode = parts[0];
          const credit = parseFloat(parts[1]);
          const sessional = parts[3].toLowerCase() === 'yes';
          const grade = parts[4] as keyof typeof GRADE_SYSTEM;
          
          if (courseCode && !isNaN(credit) && GRADE_OPTIONS.includes(grade)) {
            parsedCourses.push({
              courseCode,
              credit,
              grade,
              sessional,
              courseType: 'regular'
            });
          }
        }
      }

      if (parsedCourses.length === 0) {
        toast.error('No valid courses found. Please check the format.');
        return;
      }

      setCourses(parsedCourses);
      toast.success(`Successfully parsed ${parsedCourses.length} courses`);
    } catch (error) {
      console.log('Error parsing copy-paste data:', error);
      toast.error('Error parsing results. Please check the format.');
    }
  };

  const autoSave = useCallback(async (coursesToSave: Course[], showToast: boolean = false) => {
    if (!selectedSemester || !userEmail) {
      return;
    }

    setIsAutoSaving(true);
    
    try {
      const cgpaToSave = coursesToSave.length > 0 ? calculateSemesterCGPA(coursesToSave).cgpa : 0;
      const totalCreditsToSave = coursesToSave.length > 0 ? coursesToSave.reduce((sum, course) => {
        const credit = typeof course.credit === 'string' ? parseFloat(course.credit) || 0 : course.credit;
        return sum + (isNaN(credit) ? 0 : credit);
      }, 0) : 0;

      const response = await fetch('/api/results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          semester: selectedSemester,
          courses: coursesToSave.map(course => ({
            ...course,
            credit: typeof course.credit === 'string' ? parseFloat(course.credit) || 0 : course.credit
          })),
          cgpa: cgpaToSave,
          totalCredits: totalCreditsToSave
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLastSaved(new Date());
        if (showToast) {
          toast.success('💾 Auto-saved successfully!');
        }
        
        await fetchUserData(userEmail);
      } else {
        console.error('Auto-save failed with response:', data);
        if (showToast) {
          toast.error(data.message || 'Auto-save failed');
        }
      }
    } catch (error) {
      console.error('Error auto-saving results:', error);
      if (showToast) {
        toast.error('Auto-save failed. Please check your connection.');
      }
    } finally {
      setIsAutoSaving(false);
    }
  }, [selectedSemester, userEmail, fetchUserData]);
  
  useEffect(() => {
    if (selectedSemester && userEmail) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      const currentCourses = courses;
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave(currentCourses, false);
      }, 100);
    }
  }, [courses, selectedSemester, userEmail, autoSave]);

  
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  const logout = () => {
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  if (!userEmail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--surface-secondary))]">
      <nav className="bg-[rgb(var(--surface-primary))] border-b border-[rgb(var(--border-primary))]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="CUET Logo" 
                width={32} 
                height={40}
                className="object-contain cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Calculator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-[rgb(var(--surface-primary))] rounded-xl p-6 border border-[rgb(var(--border-primary))]">
          {/* Semester Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Semester
            </label>
            <Select value={selectedSemester} onValueChange={handleSemesterChange}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Choose semester..." />
              </SelectTrigger>
              <SelectContent>
                {SEMESTER_OPTIONS.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSemester && (
            <>
              {/* Tab Navigation */}
              <div className="flex bg-gray-50 rounded-xl p-2 mb-6 border border-gray-200">
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-3 px-6 font-semibold text-sm rounded-lg transition-all duration-200 ${
                    activeTab === 'manual'
                      ? 'bg-blue-600 text-white transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white -sm'
                  }`}
                >
                  📝 Manual Entry
                </button>
                <button
                  onClick={() => {
                    setActiveTab('copypaste');
                    setShowInstructionDialog(true);
                  }}
                  className={`flex-1 py-3 px-6 font-semibold text-sm rounded-lg transition-all duration-200 ${
                    activeTab === 'copypaste'
                      ? 'bg-blue-600 text-white transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white -sm'
                  }`}
                >
                  📋 Copy Paste Result
                </button>
              </div>

              {/* Course Count and Live CGPA */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800">
                    Courses Added: {courses.length}
                  </span>
                  <span className="text-lg font-bold text-blue-900">
                    Current CGPA: {formatCGPA(currentCGPA)}
                  </span>
                </div>
              </div>

              {/* Manual Entry Tab */}
              {activeTab === 'manual' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Code
                      </label>
                      <Input
                        type="text"
                        value={currentCourse.courseCode}
                        onChange={(e) => setCurrentCourse({ ...currentCourse, courseCode: e.target.value })}
                        placeholder="e.g., CSE-141"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Credit
                      </label>
                      <Input
                        type="number"
                        step="0.25"
                        min="0"
                        max="6"
                        value={currentCourse.credit}
                        onChange={(e) => setCurrentCourse({ ...currentCourse, credit: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade
                      </label>
                      <Select
                        value={currentCourse.grade}
                        onValueChange={(value) => setCurrentCourse({ ...currentCourse, grade: value as keyof typeof GRADE_SYSTEM })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADE_OPTIONS.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade} ({GRADE_SYSTEM[grade].point})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={addCourse}
                        disabled={!currentCourse.courseCode.trim() || !currentCourse.credit}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                      >
                        Add Course
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={currentCourse.sessional}
                        onCheckedChange={(checked) => setCurrentCourse({ ...currentCourse, sessional: !!checked })}
                      />
                      <span className="text-sm text-[var(--text-secondary)]">Sessional Course (Optional)</span>
                    </label>

                    <Select
                      value={currentCourse.courseType}
                      onValueChange={(value) => setCurrentCourse({ ...currentCourse, courseType: value as 'regular' | 'retake' | 'improvement' })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="retake">Retake</SelectItem>
                        <SelectItem value="improvement">Improvement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Copy Paste Tab */}
              {activeTab === 'copypaste' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Select and Paste Your Result Data from <a href="https://course.cuet.ac.bd" target="_blank" className="font-bold text-blue-600 hover:underline">course.cuet.ac.bd</a>
                    </label>
                    <textarea
                      value={copyPasteText}
                      onChange={(e) => setCopyPasteText(e.target.value)}
                      placeholder="Course Code	Course Credit	Level-Term	Sessional	Result	Course type
Phy-141	3	Level 1 - Term 1	No	B	regular
Math-141	3	Level 1 - Term 1	No	A-	regular"
                      rows={8}
                      className="w-full px-4 py-3 border border-[rgb(var(--border-primary))] bg-[rgb(var(--surface-primary))] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  <button
                    onClick={parseCopyPasteResult}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                  >
                    Parse Results
                  </button>
                </div>
              )}

              {/* Course List */}
              {courses.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Added Courses</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-[rgb(var(--border-primary))]">
                      <thead className="bg-[rgb(var(--surface-secondary))]">
                        <tr>
                          <th className="border border-[rgb(var(--border-primary))] px-4 py-2 text-left text-[var(--text-secondary)]">Course Code</th>
                          <th className="border border-[rgb(var(--border-primary))] px-4 py-2 text-left text-[var(--text-secondary)]">Credit</th>
                          <th className="border border-[rgb(var(--border-primary))] px-4 py-2 text-left text-[var(--text-secondary)]">Grade</th>
                          <th className="border border-[rgb(var(--border-primary))] px-4 py-2 text-left text-[var(--text-secondary)]">Points</th>
                          <th className="border border-[rgb(var(--border-primary))] px-4 py-2 text-left text-[var(--text-secondary)]">Sessional</th>
                          <th className="border border-[rgb(var(--border-primary))] px-4 py-2 text-left text-[var(--text-secondary)]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course, index) => (
                          <tr key={index} className="hover:bg-[rgb(var(--surface-secondary))]">
                            <td className="border border-[rgb(var(--border-primary))] px-2 py-2">
                              <Input
                                value={course.courseCode}
                                onChange={(e) => updateCourseField(index, 'courseCode', e.target.value)}
                                className="h-8 text-sm"
                                placeholder="Course Code"
                              />
                            </td>
                            <td className="border border-[rgb(var(--border-primary))] px-2 py-2">
                              <Input
                                type="number"
                                step="0.25"
                                min="0"
                                max="6"
                                value={course.credit}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === '') {
                                    updateCourseField(index, 'credit', '');
                                  } else {
                                    const num = parseFloat(value);
                                    if (!isNaN(num) && num >= 0) {
                                      updateCourseField(index, 'credit', num);
                                    }
                                  }
                                }}
                                className="h-8 text-sm w-20"
                              />
                            </td>
                            <td className="border border-[rgb(var(--border-primary))] px-2 py-2">
                              <Select
                                value={course.grade}
                                onValueChange={(value) => updateCourseField(index, 'grade', value as keyof typeof GRADE_SYSTEM)}
                              >
                                <SelectTrigger className="h-8 text-sm w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {GRADE_OPTIONS.map((grade) => (
                                    <SelectItem key={grade} value={grade}>
                                      {grade} ({GRADE_SYSTEM[grade].point})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="border border-[rgb(var(--border-primary))] px-4 py-2 text-center text-[var(--text-primary)]">
                              {GRADE_SYSTEM[course.grade].point}
                            </td>
                            <td className="border border-[rgb(var(--border-primary))] px-4 py-2 text-center">
                              <Checkbox
                                checked={course.sessional}
                                onCheckedChange={(checked) => updateCourseField(index, 'sessional', checked)}
                              />
                            </td>
                            <td className="border border-[rgb(var(--border-primary))] px-4 py-2">
                              <button
                                onClick={() => removeCourse(index)}
                                className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Summary and Auto-save Status */}
              {selectedSemester && (
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  {courses.length > 0 ? (
                    <div className="text-[var(--text-primary)] text-lg font-semibold">
                      Total Credits: {courses.reduce((sum, course) => {
                        const credit = typeof course.credit === 'string' ? parseFloat(course.credit) : course.credit;
                        return sum + (isNaN(credit) ? 0 : credit);
                      }, 0)} | 
                      CGPA: {formatCGPA(currentCGPA)}
                    </div>
                  ) : (
                    <div className="text-[var(--text-secondary)] text-lg">
                      No courses added yet
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    {isAutoSaving ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Auto-saving...</span>
                      </div>
                    ) : lastSaved ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Auto-saved at {lastSaved.toLocaleTimeString()}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <span>Will auto-save changes</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Instruction Dialog */}
      <Dialog open={showInstructionDialog} onOpenChange={setShowInstructionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>How to Copy Results from CUET Website</DialogTitle>
            <DialogDescription>
              Follow these steps to copy your results from the official CUET website:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-700">
              1. Visit{' '}
              <a 
                href="https://course.cuet.ac.bd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:underline"
              >
                course.cuet.ac.bd
              </a>
              {' '}and log in to your account
            </div>
            
            <div className="text-sm text-gray-700">
              2. Navigate to your results page and select the result table as shown in the image below:
            </div>
            
            <div className="border rounded-lg p-2 bg-gray-50">
              <Image 
                src="/assets/selection-portion-image.png" 
                alt="How to select result table from CUET website" 
                width={600} 
                height={400} 
                className="w-full h-auto rounded"
                priority
              />
            </div>
            
            <div className="text-sm text-gray-700">
              3. Copy the selected table data (Ctrl+C or Cmd+C)
            </div>
            
            <div className="text-sm text-gray-700">
              4. Come back to this page and paste the data in the text area
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowInstructionDialog(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                OK, Got it!
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}