'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => setIsChecking(false), 500);
  }, []);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#64748b" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Diagonal lines */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-slate-300 opacity-20 rotate-45 origin-left"
              style={{
                width: '200%',
                left: `${i * 10}%`,
                top: `${(i * 15) % 100}%`,
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
              <span className="text-xl font-bold text-slate-800">CGPA Calculator</span>
            </div>
            <Link href={"/login"} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 px-4 py-2 rounded-full text-sm text-slate-600 mb-8 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Trusted by CUET students
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              CUET CGPA
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Calculator
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Calculate your CGPA effortlessly with precision built for
              <span className="font-medium text-slate-800"> Chittagong University of Engineering & Technology</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24">
              <button className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 px-8 rounded-2xl text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 group">
                Start Calculating
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <Link href={"/about"} className="inline-flex items-center justify-center bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-slate-200/50 text-slate-700 font-medium py-4 px-8 rounded-2xl text-lg transition-all duration-200 hover:shadow-lg">
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 bg-white/40 backdrop-blur-sm border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-slate-900 group-hover:scale-110 transition-transform duration-200">130+</div>
              <div className="text-slate-600 text-lg">Active Students</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-slate-900 group-hover:scale-110 transition-transform duration-200">13</div>
              <div className="text-slate-600 text-lg">Departments</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-slate-900 group-hover:scale-110 transition-transform duration-200">100%</div>
              <div className="text-slate-600 text-lg">Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything you need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
              Powerful features designed to make academic tracking simple and effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "📊",
                title: "Easy Calculation",
                description: "Copy-paste your results or manually enter grades to get instant CGPA calculations with real-time updates.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: "💾",
                title: "Save & Track",
                description: "Store your semester results securely and track your academic progress over time with detailed analytics.",
                color: "from-teal-500 to-emerald-600"
              },
              {
                icon: "🎯",
                title: "Smart Planning",
                description: "Set target CGPA and get intelligent insights on what you need in remaining semesters to achieve your goals.",
                color: "from-emerald-500 to-teal-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-3xl hover:bg-white/80 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="relative z-10 py-32 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                Key Features
              </h2>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
              Advanced capabilities that make CGPA calculation accurate and effortless
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Precise Calculation",
                  description: "Uses exact CUET grade point system with proper truncation (not rounding)"
                },
                {
                  title: "Auto-save",
                  description: "Automatically saves your progress with every change"
                },
                {
                  title: "Course Type Support", 
                  description: "Handles regular, retake, and improvement courses correctly"
                },
                {
                  title: "Target Planning",
                  description: "Shows required CGPA for remaining semesters to reach your goal"
                },
                {
                  title: "Input Validation",
                  description: "Filters invalid courses and ensures data integrity"
                },
                {
                  title: "Copy-Paste Support",
                  description: "Import results directly from CUET portal with intelligent parsing"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 hover:bg-white/80 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 font-light">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              How it works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
              Get started in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Login with CUET Email",
                description: "Use your official CUET student email to securely access the platform",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "2", 
                title: "Enter Your Grades",
                description: "Add courses manually or copy-paste from your result sheet",
                color: "from-teal-500 to-emerald-500"
              },
              {
                step: "3",
                title: "Track Progress", 
                description: "View your CGPA, save results, and plan for future semesters",
                color: "from-emerald-500 to-teal-500"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} !text-white rounded-3xl flex items-center justify-center text-3xl font-bold mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to calculate your CGPA?
          </h2>
          <p className="text-xl !text-slate-300 mb-10 font-light">
            Join 130+ students who trust our platform for accurate CGPA calculations
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium py-4 px-10 rounded-2xl text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 group">
            Get Started Now
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}