'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyApplications, fetchClientApplications, updateApplicationStatus } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ClipboardList, ExternalLink, Check, X as XIcon, Eye, Users } from 'lucide-react';
import { cn, getMatchScoreColor, getMatchScoreBg, formatDate } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-500',
  SHORTLISTED: 'bg-blue-500/10 text-blue-500',
  HIRED: 'bg-emerald-500/10 text-emerald-500',
  REJECTED: 'bg-red-500/10 text-red-500',
};

export default function ApplicationsPage() {
  const { user } = useAuth();
  const isClient = user?.role === 'CLIENT';

  return isClient ? <ClientApplicationsPage /> : <FreelancerApplicationsPage />;
}

/* ───── FREELANCER: My Applications ───── */
function FreelancerApplicationsPage() {
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

/* ───── CLIENT: Received Applications ───── */
function ClientApplicationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['client-applications'],
    queryFn: fetchClientApplications,
  });

  const statusMutation = useMutation({
    mutationFn: ({ appId, status }: { appId: string; status: string }) =>
      updateApplicationStatus(appId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-applications'] });
    },
  });

  const applications = (data as any[]) ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Received Applications
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review and manage applications from freelancers.
          </p>
        </div>
        <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
          {applications.length} total
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card border border-[rgb(var(--border))] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-card border border-[rgb(var(--border))] rounded-2xl">
          <Users className="w-12 h-12 text-primary mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No applications received yet</p>
          <p className="text-muted-foreground text-sm mt-1">Post a gig to start receiving applications from freelancers.</p>
          <Link href="/gigs/new" className="btn-primary mt-4 inline-flex">Post a Gig</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app: any, i: number) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-[rgb(var(--border))] rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Gig title */}
                  <Link href={`/gigs/${app.gigId}`} className="text-xs text-primary hover:underline font-medium">
                    {app.gig?.title ?? 'Unknown Gig'}
                  </Link>

                  {/* Freelancer info */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {(app.freelancer?.user?.name || '?')[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{app.freelancer?.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{app.freelancer?.user?.email || ''}</p>
                    </div>
                    {app.matchScore != null && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getMatchScoreBg(app.matchScore)} ${getMatchScoreColor(app.matchScore)}`}>
                        {Math.round(app.matchScore)}% match
                      </span>
                    )}
                  </div>

                  {/* Cover letter */}
                  {app.coverLetter && (
                    <div className="mt-3 text-sm text-muted-foreground bg-muted rounded-lg p-3">
                      <p className="text-xs font-medium text-foreground mb-1">Cover Letter:</p>
                      {app.coverLetter}
                    </div>
                  )}

                  {/* Resume link */}
                  {app.freelancer?.resumeUrl && (
                    <a
                      href={app.freelancer.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-sm text-primary hover:underline"
                    >
                      <Eye className="w-4 h-4" /> View Resume
                    </a>
                  )}
                </div>

                {/* Status / Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {app.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => statusMutation.mutate({ appId: app.id, status: 'SHORTLISTED' })}
                        disabled={statusMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-xs font-medium disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => statusMutation.mutate({ appId: app.id, status: 'REJECTED' })}
                        disabled={statusMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs font-medium disabled:opacity-50"
                      >
                        <XIcon className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className={cn(
                      'text-xs px-3 py-1.5 rounded-lg font-medium',
                      STATUS_STYLES[app.status] ?? 'bg-muted text-muted-foreground'
                    )}>
                      {app.status}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{formatDate(app.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
