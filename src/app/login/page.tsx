'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { validateCUETEmail, extractInfoFromEmail } from '@/lib/constants';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateCUETEmail(email)) {
      setError('Please enter a valid CUET student email (format: u{yydcrrr}@student.cuet.ac.bd)');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Verification code sent to your email!');
        setStep('otp');
      } else {
        setError(data.message || 'Failed to send verification code');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);

      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set cookie for middleware
        document.cookie = `userEmail=${email}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
        localStorage.setItem('userEmail', email);
        window.location.href = '/calculator';
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const emailInfo = validateCUETEmail(email) ? extractInfoFromEmail(email) : null;

  return (
    <div className="min-h-screen bg-[rgb(var(--surface-secondary))] flex items-center justify-center p-4">
      <div className="bg-[rgb(var(--surface-primary))] border border-[rgb(var(--border-primary))] rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="CUET Logo" 
                width={64} 
                height={80}
                className="object-contain cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            {step === 'email' ? 'Login to CUET CGPA Calculator' : 'Verify Your Email'}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {step === 'email' 
              ? 'Enter your CUET student email to get started' 
              : 'Enter the 6-digit code sent to your email'
            }
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                CUET Student Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="u{yydcrrr}@student.cuet.ac.bd"
                className="h-12"
                required
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Format: u + year(2 digits) + dept code(2 digits) + roll(3 digits)
              </p>
              
              {emailInfo && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Year:</strong> {emailInfo.year} | 
                    <strong> Department:</strong> {emailInfo.department} | 
                    <strong> Roll:</strong> {emailInfo.rollNumber}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Verification Code
              </label>
              <Input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="h-12 text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 text-center">
                Code sent to: {email}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}