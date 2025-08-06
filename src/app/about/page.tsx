'use client';

import Image from "next/image";
import Link from "next/link";

const GRADE_SYSTEM = {
  'A+': { point: 4.00, percentage: 80 },
  'A': { point: 3.75, percentage: 75 },
  'A-': { point: 3.50, percentage: 70 },
  'B+': { point: 3.25, percentage: 65 },
  'B': { point: 3.00, percentage: 60 },
  'B-': { point: 2.75, percentage: 55 },
  'C+': { point: 2.50, percentage: 50 },
  'C': { point: 2.25, percentage: 45 },
  'D': { point: 2.00, percentage: 40 },
  'F': { point: 0.00, percentage: 0 }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
          <defs>
            <pattern id="about-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#64748b" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-grid)" />
        </svg>
        
        {/* Diagonal lines */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-slate-300 opacity-20 rotate-45 origin-left"
              style={{
                width: '200%',
                left: `${i * 12}%`,
                top: `${(i * 18) % 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
              <span className="text-xl font-bold text-slate-800">About</span>
            </div>
            <Link href={"/"} className="bg-slate-900 hover:bg-slate-800 !text-white px-4 py-1.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
              Go Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 px-4 py-2 rounded-full text-sm text-slate-600 mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Academic Excellence Guide
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            How CGPA
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Calculation Works
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
            Understanding the algorithm behind accurate CGPA computation for CUET students
          </p>
        </div>

        {/* CGPA Formula Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">CGPA Formula</h2>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200/50 rounded-3xl p-8 mb-8 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-slate-900 mb-6">
                  CGPA = (Total Grade Points) ÷ (Total Credits)
                </div>
                <div className="text-lg font-mono text-slate-700 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl inline-block border border-blue-200">
                  Grade Points = Credit Hours × Grade Point Value
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Step-by-step Calculation
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { step: "1", title: "Course Validation", desc: "Filter out courses with invalid credit hours or grades" },
                  { step: "2", title: "Grade Points Calculation", desc: "For each course, multiply credit hours by the grade point value" },
                  { step: "3", title: "Summation", desc: "Add up all grade points and all credit hours separately" },
                  { step: "4", title: "Division", desc: "Divide total grade points by total credit hours" },
                  { step: "5", title: "Formatting", desc: "Truncate result to 2 decimal places (no rounding)" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 !text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 font-light text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grade System Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">CUET Grade System</h2>
            </div>
            <p className="text-lg text-slate-600 font-light">Official grading scale used across all departments</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="px-6 py-4 text-left font-bold text-slate-900 text-lg">Letter Grade</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-900 text-lg">Grade Points</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-900 text-lg">Percentage Range</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(GRADE_SYSTEM).map(([grade, info], index) => (
                    <tr key={grade} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors group ${index % 2 === 0 ? 'bg-slate-25' : ''}`}>
                      <td className="px-6 py-4">
                        <span className={`font-mono font-bold text-xl px-3 py-1 rounded-lg ${
                          grade === 'A+' ? 'bg-emerald-100 text-emerald-800' :
                          grade === 'F' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        } group-hover:scale-105 transition-transform inline-block`}>
                          {grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-lg font-semibold text-slate-700">{info.point.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {grade === 'F' ? (
                          <span className="text-red-600 font-medium">Below 40%</span>
                        ) : (
                          <span>{info.percentage}% and above</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Example Calculation */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Example Calculation</h2>
            </div>
            <p className="text-lg text-slate-600 font-light">See how CGPA is calculated with real course data</p>
          </div>
          
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">Sample Semester Courses</h3>
            
            <div className="mb-6 border border-amber-300 rounded-2xl overflow-hidden">
              <table className="w-full bg-white/60 backdrop-blur-sm overflow-x-auto">
                <thead>
                  <tr className="bg-amber-100/50">
                    <th className="px-4 py-3 text-left font-bold text-amber-900">Course</th>
                    <th className="px-4 py-3 text-center font-bold text-amber-900">Credits</th>
                    <th className="px-4 py-3 text-center font-bold text-amber-900">Grade</th>
                    <th className="px-4 py-3 text-center font-bold text-amber-900">Grade Points</th>
                    <th className="px-4 py-3 text-center font-bold text-amber-900">Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { course: "Math-141", credits: "3.0", grade: "A", points: "3.75", total: "11.25" },
                    { course: "Phy-141", credits: "3.0", grade: "A-", points: "3.50", total: "10.50" },
                    { course: "CSE-141", credits: "3.0", grade: "B+", points: "3.25", total: "9.75" },
                    { course: "Eng-141", credits: "2.0", grade: "A+", points: "4.00", total: "8.00" }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-amber-100 hover:bg-amber-50/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{row.course}</td>
                      <td className="px-4 py-3 text-center font-mono">{row.credits}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono font-bold px-2 py-1 bg-blue-100 text-blue-800 rounded">{row.grade}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">{row.points}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold">{row.total}</td>
                    </tr>
                  ))}
                  <tr className="bg-amber-100/50 font-bold text-amber-900">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-center font-mono">11.0</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-center font-mono">39.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm border border-emerald-200 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-slate-900 mb-3">
                  CGPA = 39.50 ÷ 11.0 = 3.590909...
                </div>
                <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 !text-white px-6 py-3 rounded-xl">
                  <span className="text-xl font-mono font-bold">Final CGPA = 3.59</span>
                  <div className="text-sm opacity-90">(truncated, not rounded)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall CGPA Section */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Overall CGPA Calculation</h2>
            </div>
            
            <div className="prose max-w-none text-slate-600 font-light leading-relaxed">
              <p className="text-lg mb-6">
                The overall CGPA is calculated by considering <strong className="text-slate-900">all courses from all semesters</strong> as a single pool:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {[
                  "Combine all courses from every semester",
                  "Calculate total grade points across all semesters",
                  "Calculate total credit hours across all semesters", 
                  "Apply the same CGPA formula: Total Grade Points ÷ Total Credits"
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 !text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <p className="text-slate-600 font-light">{step}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 border border-blue-200/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Important Note:</p>
                    <p className="text-blue-800">
                      The overall CGPA is <strong>NOT</strong> the average of semester CGPAs. 
                      It&apos;s calculated using all individual course grades and credits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 !text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Key Features</h2>
            </div>
            <p className="text-lg text-slate-600 font-light">Why our calculator stands out from the rest</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Precise Calculation", desc: "Uses exact CUET grade point system with proper truncation (not rounding)", icon: "🎯" },
                { title: "Auto-save", desc: "Automatically saves your progress with every change", icon: "💾" },
                { title: "Course Type Support", desc: "Handles regular, retake, and improvement courses correctly", icon: "📚" },
                { title: "Target Planning", desc: "Shows required CGPA for remaining semesters to reach your goal", icon: "🎯" },
                { title: "Input Validation", desc: "Filters invalid courses and ensures data integrity", icon: "✅" },
                { title: "Copy-Paste Support", desc: "Import results directly from CUET portal with intelligent parsing", icon: "📋" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 hover:bg-white/80 hover:shadow-lg hover:scale-105 transition-all duration-200 group"
                >
                  <div className="text-2xl group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{feature.title}</h3>
                    <p className="text-slate-600 font-light leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12">
            <h2 className="text-2xl md:text-3xl font-bold !text-white mb-4">
              Ready to calculate your CGPA?
            </h2>
            <p className="text-xl !text-slate-300 mb-8 font-light">
              Experience the most accurate CGPA calculator for CUET students
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 !text-white font-medium py-4 px-10 rounded-2xl text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 group">
              Start Calculating Your CGPA
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}