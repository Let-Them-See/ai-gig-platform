'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-surface-200/50">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-surface-900">
              GigForge
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/gigs" className="text-sm font-medium text-surface-800/70 hover:text-brand-600 transition-colors">
              Browse Gigs
            </Link>
            <Link href="/freelancers" className="text-sm font-medium text-surface-800/70 hover:text-brand-600 transition-colors">
              Freelancers
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-surface-800/70 hover:text-brand-600 transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="btn-primary text-sm py-2 px-5">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 text-sm font-medium text-surface-800/70 hover:text-brand-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <Link href="/sign-in" className="text-sm font-medium text-surface-800/70 hover:text-brand-600 transition-colors px-4 py-2">
                Sign In
              </Link>
            )}
            {!isAuthenticated && (
              <Link href="/sign-up" className="btn-primary text-sm py-2.5 px-5">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-surface-800/70"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-surface-200">
            <div className="flex flex-col gap-3">
              <Link href="/gigs" className="px-4 py-2 text-sm font-medium text-surface-800/70 hover:bg-surface-50 rounded-lg">
                Browse Gigs
              </Link>
              <Link href="/freelancers" className="px-4 py-2 text-sm font-medium text-surface-800/70 hover:bg-surface-50 rounded-lg">
                Freelancers
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary text-sm py-2 px-5 text-center">
                  Dashboard
                </Link>
              ) : (
                <Link href="/sign-in" className="px-4 py-2 text-sm font-medium text-surface-800/70 hover:bg-surface-50 rounded-lg">
                  Sign In
                </Link>
              )}
              {!isAuthenticated && (
                <Link href="/sign-up" className="btn-primary text-sm py-2 px-5 text-center">
                  Get Started
                </Link>
              )}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-surface-800/70 hover:bg-surface-50 rounded-lg text-left"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
