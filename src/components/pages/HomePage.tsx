'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      router.push('/profile');
      return;
    }
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

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
              <span className="text-xl font-bold text-[var(--text-primary)]">CGPA Calculator</span>
            </div>
            <Link 
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border-primary))] px-4 py-2 rounded-full text-sm text-[var(--text-secondary)] mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Trusted by CUET students
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
            CUET CGPA
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Calculator</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-3xl mx-auto leading-relaxed">
            Calculate your CGPA effortlessly with our comprehensive tool designed specifically for 
            <span className="font-semibold text-blue-600"> Chittagong University of Engineering & Technology</span> students.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link 
              href="/login"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105"
            >
              <span className="mr-2">🚀</span>
              Start Calculating
            </Link>
            
            <Link 
              href="/about"
              className="inline-flex items-center justify-center bg-[rgb(var(--surface-primary))] hover:bg-[rgb(var(--surface-elevated))] border border-[rgb(var(--border-primary))] text-[var(--text-primary)] font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300"
            >
              <span className="mr-2">📖</span>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[rgb(var(--surface-primary))] border-t border-[rgb(var(--border-primary))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Everything you need for CGPA calculation
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Powerful features designed to make academic tracking simple and effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group p-8 bg-[rgb(var(--surface-secondary))] border border-[rgb(var(--border-primary))] rounded-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Easy Calculation</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">Copy-paste your results or manually enter grades to get instant CGPA calculations with real-time updates.</p>
            </div>
            
            <div className="group p-8 bg-[rgb(var(--surface-secondary))] border border-[rgb(var(--border-primary))] rounded-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Save & Track</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">Store your semester results securely and track your academic progress over time with detailed analytics.</p>
            </div>
            
            <div className="group p-8 bg-[rgb(var(--surface-secondary))] border border-[rgb(var(--border-primary))] rounded-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Smart Planning</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">Set target CGPA and get intelligent insights on what you need in remaining semesters to achieve your goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-[rgb(var(--surface-secondary))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 flex items-center justify-center">
              <span className="mr-3 text-4xl">⚡</span>
              Key Features of Our Calculator
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Advanced features that make CGPA calculation accurate and effortless
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 bg-[rgb(var(--surface-primary))] p-6 rounded-xl border border-[rgb(var(--border-primary))]">
                  <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Precise Calculation</h3>
                    <p className="text-[var(--text-secondary)]">Uses exact CUET grade point system with proper truncation (not rounding)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 bg-[rgb(var(--surface-primary))] p-6 rounded-xl border border-[rgb(var(--border-primary))]">
                  <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Course Type Support</h3>
                    <p className="text-[var(--text-secondary)]">Handles regular, retake, and improvement courses correctly</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 bg-[rgb(var(--surface-primary))] p-6 rounded-xl border border-[rgb(var(--border-primary))]">
                  <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Input Validation</h3>
                    <p className="text-[var(--text-secondary)]">Filters invalid courses and ensures data integrity</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 bg-[rgb(var(--surface-primary))] p-6 rounded-xl border border-[rgb(var(--border-primary))]">
                  <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Auto-save</h3>
                    <p className="text-[var(--text-secondary)]">Automatically saves your progress with every change</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 bg-[rgb(var(--surface-primary))] p-6 rounded-xl border border-[rgb(var(--border-primary))]">
                  <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Target Planning</h3>
                    <p className="text-[var(--text-secondary)]">Shows required CGPA for remaining semesters to reach your goal</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 bg-[rgb(var(--surface-primary))] p-6 rounded-xl border border-[rgb(var(--border-primary))]">
                  <span className="text-green-500 text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Copy-Paste Support</h3>
                    <p className="text-[var(--text-secondary)]">Import results directly from CUET portal with intelligent parsing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
          
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-3xl !text-white md:text-4xl font-bold mb-2">130+</div>
              <div className="!text-blue-100 text-sm md:text-base">Students Using</div>
            </div>
            <div>
              <div className="text-3xl !text-white md:text-4xl font-bold mb-2">13</div>
              <div className="!text-blue-100 text-sm md:text-base">Departments Supported</div>
            </div>
            <div>
              <div className="text-3xl !text-white md:text-4xl font-bold mb-2">100%</div>
              <div className="!text-blue-100 text-sm md:text-base">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-[rgb(var(--surface-secondary))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              How it works
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Get started in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 !text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Login with CUET Email</h3>
              <p className="text-[var(--text-secondary)]">Use your official CUET student email to securely access the platform</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 !text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Enter Your Grades</h3>
              <p className="text-[var(--text-secondary)]">Add courses manually or copy-paste from your result sheet</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 !text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Track Progress</h3>
              <p className="text-[var(--text-secondary)]">View your CGPA, save results, and plan for future semesters</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}