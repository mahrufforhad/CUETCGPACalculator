'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GRADE_OPTIONS, GRADE_SYSTEM } from '@/lib/constants';
import { calculateSemesterCGPA, formatCGPA } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Course {
  courseCode: string;
  credit: number;
  grade: keyof typeof GRADE_SYSTEM;
  sessional: boolean;
  courseType: 'regular' | 'retake' | 'improvement';
}

interface SemesterResult {
  semester: string;
  courses: Course[];
  cgpa: number;
  totalCredits: number;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  email: string;
  studentId: string;
  year: string;
  department: string;
  rollNumber: string;
  name?: string;
  overallCGPA: number;
  totalCredits: number;
  targetCGPA?: number;
  totalSemesters: number;
  semesterResults: SemesterResult[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({
    name: '',
    targetCGPA: '',
    totalSemesters: 8
  });
  const [editingSemester, setEditingSemester] = useState<SemesterResult | null>(null);
  const [editingCourses, setEditingCourses] = useState<Course[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/login');
      return;
    }
    // Sync localStorage with cookie
    document.cookie = `userEmail=${email}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
    setUserEmail(email);
    fetchUserData(email);
  }, [router]);

  const fetchUserData = async (email: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        setEditingData({
          name: data.user.name || '',
          targetCGPA: data.user.targetCGPA?.toString() || '',
          totalSemesters: data.user.totalSemesters || 8
        });
      } else {
        toast.error(data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          name: editingData.name,
          targetCGPA: editingData.targetCGPA ? parseFloat(editingData.targetCGPA) : null,
          totalSemesters: editingData.totalSemesters
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        setIsEditing(false);
        toast.success('🎉 Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSemester = async (semester: string) => {
    if (!confirm(`Are you sure you want to delete results for ${semester}?`)) {
      return;
    }

    try {
      const response = await fetch('/api/results/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, semester }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchUserData(userEmail);
        toast.success('🗑️ Semester results deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete semester results');
      }
    } catch (error) {
      console.error('Error deleting semester results:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const calculateRequiredCGPA = () => {
    if (!userData || !userData.targetCGPA || userData.semesterResults.length >= userData.totalSemesters) {
      return null;
    }

    const completedSemesters = userData.semesterResults.length;
    const remainingSemesters = userData.totalSemesters - completedSemesters;
    
    const averageCreditsPerSemester = userData.totalCredits > 0 ? userData.totalCredits / completedSemesters : 20;
    const estimatedRemainingCredits = remainingSemesters * averageCreditsPerSemester;
    const totalEstimatedCredits = userData.totalCredits + estimatedRemainingCredits;
    
    const currentGradePoints = userData.totalCredits * userData.overallCGPA;
    const requiredTotalGradePoints = totalEstimatedCredits * userData.targetCGPA;
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

  const requiredCGPAInfo = calculateRequiredCGPA();

  const openEditDialog = (semester: SemesterResult) => {
    setEditingSemester(semester);
    setEditingCourses([...semester.courses]);
    setHasChanges(false);
  };

  const closeEditDialog = () => {
    setEditingSemester(null);
    setEditingCourses([]);
    setHasChanges(false);
  };

  const updateCourse = (index: number, field: keyof Course, value: any) => {
    const updatedCourses = [...editingCourses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setEditingCourses(updatedCourses);
    setHasChanges(true);
  };

  const saveEditedSemester = async () => {
    if (!editingSemester || !hasChanges) return;

    setIsSaving(true);
    try {
      const newCGPA = calculateSemesterCGPA(editingCourses).cgpa;
      const newTotalCredits = editingCourses.reduce((sum, course) => sum + course.credit, 0);

      const response = await fetch('/api/results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          semester: editingSemester.semester,
          courses: editingCourses,
          cgpa: newCGPA,
          totalCredits: newTotalCredits
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('📚 Semester updated successfully!');
        fetchUserData(userEmail);
        closeEditDialog();
      } else {
        toast.error(data.message || 'Failed to update semester');
      }
    } catch (error) {
      console.error('Error saving edited semester:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!userData) {
    return <div className="flex justify-center items-center min-h-screen">User data not found</div>;
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--surface-secondary))]">
      <nav className="bg-[rgb(var(--surface-primary))] border-b border-[rgb(var(--border-primary))] sticky top-0 z-10">
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
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/calculator"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Calculator
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-[rgb(var(--surface-primary))] rounded-xl border border-[rgb(var(--border-primary))] p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingData.name}
                      onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={editingData.targetCGPA}
                      onChange={(e) => setEditingData({ ...editingData, targetCGPA: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 3.50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Semesters</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={editingData.totalSemesters}
                      onChange={(e) => setEditingData({ ...editingData, totalSemesters: parseInt(e.target.value) || 8 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={updateProfile}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{userData.name || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Student ID</p>
                    <p className="font-medium">{userData.studentId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">{userData.department}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium">{userData.year}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Roll Number</p>
                    <p className="font-medium">{userData.rollNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Target CGPA</p>
                    <p className="font-medium">{userData.targetCGPA ? formatCGPA(userData.targetCGPA) : 'Not set'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Semesters</p>
                    <p className="font-medium">{userData.totalSemesters}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Academic Progress */}
            <div className="bg-[rgb(var(--surface-primary))] rounded-xl border border-[rgb(var(--border-primary))] p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Progress</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Overall CGPA</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCGPA(userData.overallCGPA)}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Total Credits</p>
                  <p className="text-2xl font-bold text-green-900">{userData.totalCredits}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Completed Semesters</p>
                  <p className="text-2xl font-bold text-purple-900">{userData.semesterResults.length} / {userData.totalSemesters}</p>
                </div>

                {requiredCGPAInfo && (
                  <div className={`p-4 rounded-lg ${requiredCGPAInfo.isAchievable ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className={`text-sm ${requiredCGPAInfo.isAchievable ? 'text-green-600' : 'text-red-600'}`}>
                      Required CGPA for Remaining Semesters
                    </p>
                    <p className={`text-2xl font-bold ${requiredCGPAInfo.isAchievable ? 'text-green-900' : 'text-red-900'}`}>
                      {formatCGPA(requiredCGPAInfo.requiredCGPA)}
                    </p>
                    <p className={`text-xs mt-1 ${requiredCGPAInfo.isAchievable ? 'text-green-600' : 'text-red-600'}`}>
                      {requiredCGPAInfo.isAchievable ? 'Achievable' : 'Not achievable with perfect scores'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Semester Results */}
          <div className="lg:col-span-2">
            <div className="bg-[rgb(var(--surface-primary))] rounded-xl border border-[rgb(var(--border-primary))] p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Semester Results</h2>

              {userData.semesterResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No semester results found.</p>
                  <Link 
                    href="/calculator"
                    className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Add Results
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {userData.semesterResults.map((semester, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{semester.semester}</h3>
                        <div className="flex flex-wrap gap-4 gap-y-2 items-center">
                          <span className="text-sm text-gray-600">
                            CGPA: <span className="font-bold">{formatCGPA(semester.cgpa)}</span>
                          </span>
                          <span className="text-sm text-gray-600">
                            Credits: <span className="font-bold">{semester.totalCredits}</span>
                          </span>
                          <button
                            onClick={() => openEditDialog(semester)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSemester(semester.semester)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full table-auto text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left">Course Code</th>
                              <th className="px-3 py-2 text-left">Credit</th>
                              <th className="px-3 py-2 text-left">Grade</th>
                              <th className="px-3 py-2 text-left">Points</th>
                              <th className="px-3 py-2 text-left">Sessional</th>
                            </tr>
                          </thead>
                          <tbody>
                            {semester.courses.map((course, courseIndex) => (
                              <tr key={courseIndex} className="border-t border-gray-100">
                                <td className="px-3 py-2">{course.courseCode}</td>
                                <td className="px-3 py-2">{course.credit}</td>
                                <td className="px-3 py-2">{course.grade}</td>
                                <td className="px-3 py-2">{GRADE_SYSTEM[course.grade].point}</td>
                                <td className="px-3 py-2">{course.sessional ? 'Yes' : 'No'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Semester Dialog */}
        <Dialog open={!!editingSemester} onOpenChange={(open) => !open && closeEditDialog()}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Edit {editingSemester?.semester} Courses</DialogTitle>
            </DialogHeader>
            
            {editingSemester && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm font-medium text-blue-800">
                      Courses: {editingCourses.length}
                    </span>
                    <span className="text-lg font-bold text-blue-900">
                      Live CGPA: {editingCourses.length > 0 ? formatCGPA(calculateSemesterCGPA(editingCourses).cgpa) : '0.00'}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <div className="min-w-full inline-block align-middle">
                    <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-300 px-2 md:px-4 py-2 text-left text-xs md:text-sm">Course Code</th>
                          <th className="border border-gray-300 px-2 md:px-4 py-2 text-left text-xs md:text-sm">Credit</th>
                          <th className="border border-gray-300 px-2 md:px-4 py-2 text-left text-xs md:text-sm">Grade</th>
                          <th className="border border-gray-300 px-2 md:px-4 py-2 text-left text-xs md:text-sm">Points</th>
                          <th className="border border-gray-300 px-2 md:px-4 py-2 text-left text-xs md:text-sm">Sess.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingCourses.map((course, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 md:px-4 py-2">
                              <input
                                type="text"
                                value={course.courseCode}
                                onChange={(e) => updateCourse(index, 'courseCode', e.target.value)}
                                className="w-full px-1 md:px-2 py-1 border border-gray-200 rounded text-xs md:text-sm min-w-0"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 md:px-4 py-2">
                              <input
                                type="number"
                                step="0.5"
                                min="0.5"
                                max="6"
                                value={course.credit}
                                onChange={(e) => updateCourse(index, 'credit', parseFloat(e.target.value) || 0.5)}
                                className="w-full px-1 md:px-2 py-1 border border-gray-200 rounded text-xs md:text-sm min-w-0"
                              />
                            </td>
                            <td className="border border-gray-300 px-2 md:px-4 py-2">
                              <Select
                                value={course.grade}
                                onValueChange={(value) => updateCourse(index, 'grade', value)}
                              >
                                <SelectTrigger className="w-full h-8 px-1 md:px-2 text-xs md:text-sm min-w-0">
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
                            <td className="border border-gray-300 px-2 md:px-4 py-2 text-center text-xs md:text-sm">
                              {GRADE_SYSTEM[course.grade].point}
                            </td>
                            <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={course.sessional}
                                onChange={(e) => updateCourse(index, 'sessional', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <button
                onClick={closeEditDialog}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedSemester}
                disabled={!hasChanges || isSaving}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg order-1 sm:order-2"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}