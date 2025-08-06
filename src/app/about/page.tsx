'use client';

import { GRADE_SYSTEM } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--surface-secondary))]">
      {/* Navigation */}
      <nav className="bg-[rgb(var(--surface-primary))] border-b border-[rgb(var(--border-primary))] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
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
              <span className="text-xl font-bold text-[var(--text-primary)]">About</span>
            </div>
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Go Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-[rgb(var(--surface-primary))] rounded-2xl border border-[rgb(var(--border-primary))] p-8 mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-6 text-center">
            How CGPA Calculation Works
          </h1>
          <p className="text-lg text-[var(--text-secondary)] text-center mb-8">
            Understanding the algorithm behind accurate CGPA computation for CUET students
          </p>
        </div>

        {/* CGPA Formula Section */}
        <div className="bg-[rgb(var(--surface-primary))] rounded-2xl border border-[rgb(var(--border-primary))] p-8 mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
            <span className="mr-3 text-3xl">🧮</span>
            CGPA Formula
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-blue-900 mb-4">
                CGPA = (Total Grade Points) ÷ (Total Credits)
              </div>
              <div className="text-lg font-mono text-blue-800">
                Grade Points = Credit Hours × Grade Point Value
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Step-by-step Calculation:</h3>
            <ol className="list-decimal list-inside space-y-3 text-[var(--text-secondary)]">
              <li><strong>Course Validation:</strong> Filter out courses with invalid credit hours or grades</li>
              <li><strong>Grade Points Calculation:</strong> For each course, multiply credit hours by the grade point value</li>
              <li><strong>Summation:</strong> Add up all grade points and all credit hours separately</li>
              <li><strong>Division:</strong> Divide total grade points by total credit hours</li>
              <li><strong>Formatting:</strong> Truncate result to 2 decimal places (no rounding)</li>
            </ol>
          </div>
        </div>

        {/* Grade System Section */}
        <div className="bg-[rgb(var(--surface-primary))] rounded-2xl border border-[rgb(var(--border-primary))] p-8 mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
            <span className="mr-3 text-3xl">📊</span>
            CUET Grade System
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Letter Grade</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Grade Points</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Percentage Range</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(GRADE_SYSTEM).map(([grade, info]) => (
                  <tr key={grade} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono font-bold text-lg">{grade}</td>
                    <td className="border border-gray-300 px-4 py-3 font-mono">{info.point.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      {grade === 'F' ? 'Below 40%' : `${info.percentage}% and above`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Example Calculation */}
        <div className="bg-[rgb(var(--surface-primary))] rounded-2xl border border-[rgb(var(--border-primary))] p-8 mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
            <span className="mr-3 text-3xl">💡</span>
            Example Calculation
          </h2>
          
          <div className="bg-yellow-50 overflow-auto border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Sample Semester Courses:</h3>
            <table className="w-full border-collapse border border-yellow-300 text-sm">
              <thead>
                <tr className="bg-yellow-100">
                  <th className="border border-yellow-300 px-3 py-2 text-left">Course</th>
                  <th className="border border-yellow-300 px-3 py-2 text-left">Credits</th>
                  <th className="border border-yellow-300 px-3 py-2 text-left">Grade</th>
                  <th className="border border-yellow-300 px-3 py-2 text-left">Grade Points</th>
                  <th className="border border-yellow-300 px-3 py-2 text-left">Total Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-yellow-300 px-3 py-2">Math-141</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">3.0</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center font-mono">A</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">3.75</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">11.25</td>
                </tr>
                <tr>
                  <td className="border border-yellow-300 px-3 py-2">Phy-141</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">3.0</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center font-mono">A-</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">3.50</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">10.50</td>
                </tr>
                <tr>
                  <td className="border border-yellow-300 px-3 py-2">CSE-141</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">3.0</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center font-mono">B+</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">3.25</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">9.75</td>
                </tr>
                <tr>
                  <td className="border border-yellow-300 px-3 py-2">Eng-141</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">2.0</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center font-mono">A+</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">4.00</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">8.00</td>
                </tr>
                <tr className="bg-yellow-100 font-semibold">
                  <td className="border border-yellow-300 px-3 py-2">Total</td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">11.0</td>
                  <td className="border border-yellow-300 px-3 py-2"></td>
                  <td className="border border-yellow-300 px-3 py-2"></td>
                  <td className="border border-yellow-300 px-3 py-2 text-center">39.50</td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-lg font-mono">
                <strong>CGPA = 39.50 ÷ 11.0 = 3.590909...</strong>
              </div>
              <div className="text-lg font-mono mt-2 text-green-800">
                <strong>Final CGPA = 3.59</strong> (truncated, not rounded)
              </div>
            </div>
          </div>
        </div>

        {/* Overall CGPA Calculation */}
        <div className="bg-[rgb(var(--surface-primary))] rounded-2xl border border-[rgb(var(--border-primary))] p-8 mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
            <span className="mr-3 text-3xl">🎯</span>
            Overall CGPA Calculation
          </h2>
          
          <div className="prose max-w-none text-[var(--text-secondary)]">
            <p className="mb-4">
              The overall CGPA is calculated by considering <strong>all courses from all semesters</strong> as a single pool:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-6">
              <li>Combine all courses from every semester</li>
              <li>Calculate total grade points across all semesters</li>
              <li>Calculate total credit hours across all semesters</li>
              <li>Apply the same CGPA formula: Total Grade Points ÷ Total Credits</li>
            </ol>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                <strong>Important:</strong> The overall CGPA is NOT the average of semester CGPAs. 
                It&apos;s calculated using all individual course grades and credits.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-[rgb(var(--surface-primary))] rounded-2xl border border-[rgb(var(--border-primary))] p-8 mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
            <span className="mr-3 text-3xl">⚡</span>
            Key Features of Our Calculator
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Precise Calculation</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Uses exact CUET grade point system with proper truncation (not rounding)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Course Type Support</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Handles regular, retake, and improvement courses correctly</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Input Validation</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Filters invalid courses and ensures data integrity</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Auto-save</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Automatically saves your progress with every change</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Target Planning</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Shows required CGPA for remaining semesters to reach your goal</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Copy-Paste Support</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Import results directly from CUET portal with intelligent parsing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link 
            href="/login"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105"
          >
            <span className="mr-2">🚀</span>
            Start Calculating Your CGPA
          </Link>
        </div>
      </div>
    </div>
  );
}