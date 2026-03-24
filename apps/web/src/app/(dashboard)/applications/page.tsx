'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMyApplications } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ClipboardList, ExternalLink } from 'lucide-react';
import { cn, getMatchScoreColor, formatDate } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-500',
  SHORTLISTED: 'bg-blue-500/10 text-blue-500',
  HIRED: 'bg-emerald-500/10 text-emerald-500',
  REJECTED: 'bg-red-500/10 text-red-500',
};

export default function ApplicationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: fetchMyApplications,
  });

  const applications = (data as any[]) ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary" />
          My Applications
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track all your gig applications in one place.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-card border border-[rgb(var(--border))] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-card border border-[rgb(var(--border))] rounded-2xl">
          <ClipboardList className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">No applications yet</p>
          <p className="text-muted-foreground text-sm mt-1">Start browsing gigs and apply to get matched!</p>
          <Link href="/gigs" className="btn-primary mt-4 inline-flex">Browse Gigs</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app: any, i: number) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-[rgb(var(--border))] rounded-2xl p-5 flex items-center gap-4 card-hover"
            >
              {/* Match Score */}
              {app.matchScore !== null && (
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0',
                  app.matchScore >= 70 ? 'bg-emerald-500/10 text-emerald-500' :
                  app.matchScore >= 40 ? 'bg-amber-500/10 text-amber-500' :
                  'bg-red-500/10 text-red-500'
                )}>
                  {Math.round(app.matchScore)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-1">{app.gig?.title ?? 'Unknown Gig'}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  {app.gig?.client?.user?.name && <span>{app.gig.client.user.name}</span>}
                  {app.createdAt && <span>Applied {formatDate(app.createdAt)}</span>}
                </div>
              </div>

              <span className={cn(
                'text-xs px-3 py-1.5 rounded-lg font-medium shrink-0',
                STATUS_STYLES[app.status] ?? 'bg-muted text-muted-foreground'
              )}>
                {app.status}
              </span>

              {app.gigId && (
                <Link
                  href={`/gigs/${app.gigId}`}
                  className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
