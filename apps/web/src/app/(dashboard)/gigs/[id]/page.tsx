'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchGig, fetchMatchForGig, applyToGig, fetchApplicationsForGig, updateApplicationStatus, fetchProfile } from '@/lib/api';
import { formatCurrency, getMatchScoreColor, getMatchScoreBg, formatDate } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  ArrowLeft, MapPin, Calendar, Briefcase, Sparkles, CheckCircle2, XCircle,
  Users, FileText, Check, X as XIcon, Upload, Loader2, Eye
} from 'lucide-react';
import { useState } from 'react';

export default function GigDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isClient = user?.role === 'CLIENT';

  const { data: gig, isLoading: gigLoading } = useQuery({
    queryKey: ['gig', id],
    queryFn: () => fetchGig(id as string),
  });

  const g = gig as any;

  if (gigLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!g) {
    return <div className="text-center py-16 text-muted-foreground">Gig not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/gigs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Gigs
      </Link>

      {/* Gig Details Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-[rgb(var(--border))] rounded-2xl p-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold">{g.title}</h1>
            <p className="text-muted-foreground mt-1">
              by {g.client?.user?.name || g.client?.companyName || 'Unknown'}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {g.isRemote && (
              <span className="text-sm px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">📍 Remote</span>
            )}
            <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{g.status}</span>
          </div>
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 mb-4 mt-3">
          {g.category && (
            <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Briefcase className="w-3.5 h-3.5" /> {g.category}
            </span>
          )}
          {g.experienceLevel && (
            <span className="text-sm px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              🎯 {g.experienceLevel}
            </span>
          )}
          {g.jobType && (
            <span className="text-sm px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
              {g.jobType}
            </span>
          )}
          {g.payType && (
            <span className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground border border-[rgb(var(--border))]">
              💰 {g.payType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {g.location || 'Remote'}</span>
          {g.budgetMin != null && (
            <span className="font-semibold text-foreground/80">
              {g.payType ? `${g.payType}: ` : '₹ '}{formatCurrency(g.budgetMin)}
              {g.budgetMax && g.budgetMax !== g.budgetMin && ` – ${formatCurrency(g.budgetMax)}`}
            </span>
          )}
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Posted {formatDate(g.createdAt)}</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(g.skills ?? []).map((skill: string) => (
            <span key={skill} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">{skill}</span>
          ))}
        </div>

        {/* Description */}
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{g.description}</p>
      </motion.div>

      {/* Role-based sections */}
      {isClient ? (
        <ClientApplicationsView gigId={id as string} />
      ) : (
        <FreelancerActionsView gigId={id as string} gig={g} />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   CLIENT VIEW: Show applicants, their resumes, accept/reject
   ──────────────────────────────────────────────────────── */
function ClientApplicationsView({ gigId }: { gigId: string }) {
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', gigId],
    queryFn: () => fetchApplicationsForGig(gigId),
  });

  const statusMutation = useMutation({
    mutationFn: ({ appId, status }: { appId: string; status: string }) =>
      updateApplicationStatus(appId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', gigId] });
    },
  });

  const apps = (applications as any[]) ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-[rgb(var(--border))] rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Applications
        </h2>
        <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
          {apps.length} applicant{apps.length !== 1 ? 's' : ''}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg">No applications yet</p>
          <p className="text-sm mt-1">Freelancers will appear here when they apply.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app: any) => (
            <div key={app.id} className="bg-muted/50 border border-[rgb(var(--border))] rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {(app.freelancer?.user?.name || '?')[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{app.freelancer?.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{app.freelancer?.user?.email || ''}</p>
                    </div>
                    {app.matchScore != null && (
                      <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${getMatchScoreBg(app.matchScore)} ${getMatchScoreColor(app.matchScore)}`}>
                        {Math.round(app.matchScore)}% match
                      </span>
                    )}
                  </div>

                  {/* Skills */}
                  {app.freelancer?.skills && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {JSON.parse(app.freelancer.skills || '[]').slice(0, 6).map((s: string) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
                      ))}
                    </div>
                  )}

                  {/* Cover letter */}
                  {app.coverLetter && (
                    <div className="mt-2 text-sm text-muted-foreground bg-muted rounded-lg p-3">
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
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => statusMutation.mutate({ appId: app.id, status: 'REJECTED' })}
                        disabled={statusMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        <XIcon className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      app.status === 'SHORTLISTED' || app.status === 'HIRED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {app.status}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{formatDate(app.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────
   FREELANCER VIEW: Apply button, AI Match, resume prompt
   ──────────────────────────────────────────────────────── */
function FreelancerActionsView({ gigId, gig }: { gigId: string; gig: any }) {
  const queryClient = useQueryClient();
  const [coverLetter, setCoverLetter] = useState('');
  const [showApply, setShowApply] = useState(false);

  // Check if freelancer has a resume
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const hasResume = !!(profile as any)?.freelancerProfile?.resumeUrl || !!(profile as any)?.freelancerProfile?.resumeText;

  const { data: match, isLoading: matchLoading } = useQuery({
    queryKey: ['match', gigId],
    queryFn: () => fetchMatchForGig(gigId),
    enabled: !!gigId && hasResume,
  });

  const applyMutation = useMutation({
    mutationFn: () => applyToGig({ gigId, coverLetter }),
    onSuccess: () => {
      setShowApply(false);
      setCoverLetter('');
      queryClient.invalidateQueries({ queryKey: ['gig', gigId] });
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
      alert('Application submitted successfully! Your resume has been automatically attached.');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const m = match as any;

  return (
    <>
      {/* Apply Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-[rgb(var(--border))] rounded-2xl p-8">
        {!showApply ? (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Interested in this gig?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {hasResume
                  ? 'Your resume will be automatically attached to your application.'
                  : 'Upload your resume first for the best results.'
                }
              </p>
            </div>
            {hasResume ? (
              <button
                onClick={() => setShowApply(true)}
                className="px-8 py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Apply Now
              </button>
            ) : (
              <Link
                href="/resume"
                className="px-8 py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload Resume First
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold">Write a Cover Letter (optional)</h3>
            <p className="text-xs text-muted-foreground -mt-2">Your resume will be automatically attached.</p>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the client why you're a great fit for this role..."
              className="w-full bg-muted border border-[rgb(var(--border))] rounded-xl p-4 placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none h-32 resize-none transition-colors"
            />
            <div className="flex gap-3">
              <button
                onClick={() => applyMutation.mutate()}
                disabled={applyMutation.isPending}
                className="px-6 py-2.5 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-2"
              >
                {applyMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Application'
                )}
              </button>
              <button onClick={() => setShowApply(false)} className="px-6 py-2.5 text-muted-foreground hover:text-foreground transition">Cancel</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* AI Match Score or Upload Resume Prompt */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-[rgb(var(--border))] rounded-2xl p-8">
        {!hasResume ? (
          /* No resume — show upload prompt */
          <div className="text-center py-6">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 opacity-60" />
            <h2 className="text-lg font-semibold mb-2">AI Match Score Unavailable</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              For the AI Match feature, upload your resume. We'll analyze your skills and experience to show how well you match this gig.
            </p>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              <Upload className="w-4 h-4" /> Upload Your Resume
            </Link>
          </div>
        ) : matchLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground text-sm">Calculating AI match score...</span>
          </div>
        ) : m ? (
          /* Has resume + match data — show full AI match */
          <>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" /> AI Match Score
            </h2>

            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-4xl font-bold ${getMatchScoreColor(m.totalScore)}`}>{m.totalScore}</span>
              <span className="text-muted-foreground">/ 100</span>
              <div className="flex-1 h-2 bg-muted rounded-full ml-4">
                <div className={`h-full rounded-full ${getMatchScoreBg(m.totalScore)}`} style={{ width: `${m.totalScore}%` }} />
              </div>
            </div>

            {m.breakdown && (
              <div className="space-y-2 mb-6">
                {Object.entries(m.breakdown).map(([key, val]: [string, any]) => {
                  const score = typeof val === 'object' && val !== null ? (val.score ?? 0) : (typeof val === 'number' ? val : 0);
                  const weight = typeof val === 'object' && val !== null && val.weight != null ? val.weight : 0;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-36 capitalize">{key.replace(/([A-Z])/g, ' $1')} Match</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full">
                        <div className={`h-full rounded-full ${getMatchScoreBg(score)}`} style={{ width: `${score}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${getMatchScoreColor(score)}`}>{Math.round(score)}%</span>
                      <span className="text-xs text-muted-foreground">({Math.round(weight * 100)}%)</span>
                    </div>
                  );
                })}
              </div>
            )}

            {m.matchedSkills?.length > 0 && (
              <div className="mb-3">
                <span className="text-sm text-emerald-400 flex items-center gap-1 mb-1"><CheckCircle2 className="w-4 h-4" /> Matched Skills</span>
                <div className="flex flex-wrap gap-1.5">{m.matchedSkills.map((s: string) => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{s}</span>)}</div>
              </div>
            )}

            {m.missingSkills?.length > 0 && (
              <div>
                <span className="text-sm text-red-400 flex items-center gap-1 mb-1"><XCircle className="w-4 h-4" /> Missing Skills</span>
                <div className="flex flex-wrap gap-1.5">{m.missingSkills.map((s: string) => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{s}</span>)}</div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>AI Match data not available for this gig.</p>
          </div>
        )}
      </motion.div>
    </>
  );
}
