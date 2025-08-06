import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[rgb(var(--surface-primary))] border-t border-[rgb(var(--border-primary))]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image 
                src="/logo.png" 
                alt="CUET Logo" 
                width={40} 
                height={50}
                className="object-contain"
              />
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">CUET CGPA Calculator</h3>
                <p className="text-sm text-[var(--text-secondary)]">Chittagong University of Engineering & Technology</p>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] mb-4 max-w-md">
              The most accurate and comprehensive CGPA calculator designed specifically for CUET students. 
              Calculate, track, and plan your academic journey with confidence.
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-green-800 text-sm font-medium">✓ Accurate Grade System</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-[var(--text-secondary)] hover:text-blue-600 transition-colors">
                  Calculator
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[var(--text-secondary)] hover:text-blue-600 transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-[var(--text-secondary)] hover:text-blue-600 transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Support</h4>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>13 Departments Supported</li>
              <li>All Grade Types</li>
              <li>Auto-save Enabled</li>
              <li>Secure & Private</li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center border-t border-[rgb(var(--border-primary))] mt-8 pt-6">
          <p className="text-[var(--text-muted)] text-sm mb-8 max-w-md mx-auto">
            🔒 Secure login with your CUET student email<br/>All data encrypted and protected
          </p>
          
          <div className="flex flex-col justify-center space-x-6 text-sm text-[var(--text-muted)]">
            <span>Made for CUET Students</span>
            <span>© Hovered - 2024</span>
            <span className="text-lg mt-3">Built with 🖤 by <a href="https://facebook.com/forhadhossain.me" target="_blank" className="!text-blue-600 font-bold underline">Forhad (CSE&apos;23)</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}