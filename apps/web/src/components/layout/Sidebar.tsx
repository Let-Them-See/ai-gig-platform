'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSimpleAuth } from '@/components/providers/AuthProvider';

const clientLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/gigs', label: 'Gigs', icon: Briefcase },
  { href: '/dashboard/proposals', label: 'Proposals', icon: FileText },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const freelancerLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/freelancer/resume', label: 'Upload Resume', icon: FileText },
  { href: '/dashboard/freelancer/recommendations', label: 'Recommended Gigs', icon: Briefcase },
  { href: '/dashboard/gigs', label: 'All Gigs', icon: Briefcase },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useSimpleAuth();

  const links = user?.role === 'CLIENT' ? clientLinks : freelancerLinks;

  return (
    <aside className="w-64 min-h-screen bg-surface-50 border-r border-surface-200 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-display text-surface-900">
            GigForge
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => {
          const isActive =
            link.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                  : 'text-surface-800/60 hover:bg-surface-200/50 hover:text-surface-900'
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-surface-200">
        <Link
          href="/freelancers"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-800/60 hover:bg-surface-200/50 transition-colors"
        >
          <Users className="w-5 h-5" />
          Browse Freelancers
        </Link>
      </div>
    </aside>
  );
}
