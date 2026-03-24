'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Briefcase, Sparkles, FileText, ClipboardList,
  User, LogOut, Sun, Moon, Bell, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const freelancerNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/gigs', label: 'Browse Gigs', icon: Briefcase },
  { href: '/match', label: 'AI Matches', icon: Sparkles },
  { href: '/resume', label: 'Resume', icon: FileText },
  { href: '/applications', label: 'Applications', icon: ClipboardList },
  { href: '/profile', label: 'Profile', icon: User },
];

const clientNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/gigs', label: 'My Gigs', icon: Briefcase },
  { href: '/applications', label: 'Applications', icon: ClipboardList },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  const navItems = user?.role === 'FREELANCER' ? freelancerNav : clientNav;

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-card border-r border-[rgb(var(--border))] transition-all duration-300 z-40 flex flex-col',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-[rgb(var(--border))]">
          <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!collapsed && <span className="text-lg font-bold gradient-text whitespace-nowrap">GigForge</span>}
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'gradient-primary text-white shadow-glow/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="p-2 border-t border-[rgb(var(--border))] space-y-1">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-[rgb(var(--border))] rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────────── */}
      <div className={cn('flex-1 flex flex-col transition-all duration-300', collapsed ? 'ml-16' : 'ml-64')}>
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-[rgb(var(--border))] flex items-center justify-between px-6 sticky top-0 z-30">
          <h2 className="text-lg font-semibold capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.name}
            </span>
            <span className="text-xs px-2 py-1 rounded-lg gradient-primary text-white font-medium">
              {user?.role}
            </span>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
