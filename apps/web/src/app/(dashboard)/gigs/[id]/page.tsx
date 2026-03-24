'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchGig, fetchMatchForGig, applyToGig } from '@/lib/api';
import { formatCurrency, getMatchScoreColor, getMatchScoreBg, formatDate } from '@/lib/utils';
import { ArrowLeft, MapPin, Calendar, Briefcase, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function GigDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState('');
  const [showApply, setShowApply] = useState(false);

  const { data: gig, isLoading: gigLoading } = useQuery({
    queryKey: ['gig', id],
    queryFn: () => fetchGig(id as string),
  });

  const { data: match } = useQuery({
    queryKey: ['match', id],
    queryFn: () => fetchMatchForGig(id as string),
    enabled: !!id,
  });

  const applyMutation = useMutation({
    mutationFn: () => applyToGig({ gigId: id as string, coverLetter }),
    onSuccess: () => {
      setShowApply(false);
      alert('Application submitted successfully!');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const g = gig as any;
  const m = match as any;

  if (gigLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-brand-violet border-t-transparent rounded-full" /></div>;
  }

  if (!g) {
    return <div className="text-center py-16 text-white/40">Gig not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/gigs" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Gigs
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-xl p-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold">{g.title}</h1>
            <p className="text-white/50 mt-1">
              by {g.client?.user?.name || g.client?.companyName || 'Unknown'}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {g.isRemote && (
              <span className="text-sm px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">📍 Remote</span>
            )}
            <span className="text-sm px-3 py-1 rounded-full bg-brand-violet/10 text-brand-violet border border-brand-violet/20">{g.status}</span>
          </div>
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 mb-4 mt-3">
          {g.category && (
            <span className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-brand-violet/10 text-brand-violet border border-brand-violet/20">
              <Briefcase className="w-3.5 h-3.5" /> {g.category}
            </span>
          )}
          {g.experienceLevel && (
            <span className="text-sm px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              🎯 {g.experienceLevel}
            </span>
          )}
          {g.jobType && (
            <span className="text-sm px-3 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
              {g.jobType}
            </span>
          )}
          {g.payType && (
            <span className="text-sm px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
              💰 {g.payType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {g.location || 'Remote'}</span>
          {g.budgetMin != null && (
            <span className="font-semibold text-white/80">
              {g.payType ? `${g.payType}: ` : '₹ '}{formatCurrency(g.budgetMin)}
              {g.budgetMax && g.budgetMax !== g.budgetMin && ` – ${formatCurrency(g.budgetMax)}`}
            </span>
          )}
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Posted {formatDate(g.createdAt)}</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(g.skills ?? []).map((skill: string) => (
            <span key={skill} className="px-3 py-1 rounded-full text-sm bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">{skill}</span>
          ))}
        </div>

        {/* Description */}
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-white/70 whitespace-pre-wrap leading-relaxed mb-6">{g.description}</p>

        {/* Apply Button */}
        {!showApply ? (
          <button
            onClick={() => setShowApply(true)}
            className="px-8 py-3 bg-gradient-to-r from-brand-violet to-brand-cyan text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Apply Now
          </button>
        ) : (
          <div className="space-y-3 bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="font-semibold">Write a Cover Letter (optional)</h3>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the client why you're a great fit..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30 focus:border-brand-violet/50 focus:outline-none h-28 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => applyMutation.mutate()}
                disabled={applyMutation.isPending}
                className="px-6 py-2 bg-gradient-to-r from-brand-violet to-brand-cyan text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </button>
              <button onClick={() => setShowApply(false)} className="px-6 py-2 text-white/50 hover:text-white transition">Cancel</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* AI Match Score */}
      {m && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-xl p-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-brand-violet" /> AI Match Score
          </h2>

          <div className="flex items-baseline gap-2 mb-4">
            <span className={`text-4xl font-bold ${getMatchScoreColor(m.totalScore)}`}>{m.totalScore}</span>
            <span className="text-white/50">/ 100</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full ml-4">
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
                  <span className="text-sm text-white/50 w-36 capitalize">{key.replace(/([A-Z])/g, ' $1')} Match</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full">
                    <div className={`h-full rounded-full ${getMatchScoreBg(score)}`} style={{ width: `${score}%` }} />
                  </div>
                  <span className={`text-sm font-medium ${getMatchScoreColor(score)}`}>{Math.round(score)}%</span>
                  <span className="text-xs text-white/30">({Math.round(weight * 100)}%)</span>
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
        </motion.div>
      )}
    </div>
  );
}
