'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  MapPin
} from 'lucide-react';
import { cn, getMatchScoreColor, getMatchScoreBg, formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function MatchPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: () => fetchMatches(20),
  });

  const matches = (data as any[]) ?? [];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Match Recommendations
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gigs ranked by your AI match score. Higher score = better fit.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-card border border-[rgb(var(--border))] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20 bg-card border border-[rgb(var(--border))] rounded-2xl">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">No matches yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Complete your profile and upload a resume to get AI-powered recommendations.
          </p>
          <Link href="/resume" className="btn-primary mt-4 inline-flex">Upload Resume</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match: any, i: number) => (
            <motion.div
              key={match.gigId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-[rgb(var(--border))] rounded-2xl overflow-hidden card-hover"
            >
              <div
                className="p-5 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === match.gigId ? null : match.gigId)}
              >
                {/* Score badge */}
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold shrink-0',
                  match.totalScore >= 70 ? 'bg-emerald-500/10 text-emerald-500' :
                  match.totalScore >= 40 ? 'bg-amber-500/10 text-amber-500' :
                  'bg-red-500/10 text-red-500'
                )}>
                  {match.totalScore}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold line-clamp-1">{match.gig?.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    {match.gig?.client?.user?.name && (
                      <span>{match.gig.client.user.name}</span>
                    )}
                    {match.gig?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {match.gig.location}
                      </span>
                    )}
                    {(match.gig?.budgetMin || match.gig?.budgetMax) && (
                      <span className="flex items-center gap-1">
                        <span className="text-xs">₹</span>
                        {match.gig.budgetMin ? formatCurrency(match.gig.budgetMin) : ''}
                        {match.gig.budgetMin && match.gig.budgetMax && match.gig.budgetMin !== match.gig.budgetMax ? '–' : ''}
                        {match.gig.budgetMax && match.gig.budgetMin !== match.gig.budgetMax ? formatCurrency(match.gig.budgetMax) : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/gigs/${match.gigId}`}
                    className="btn-primary text-xs py-1.5 px-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </Link>
                  {expandedId === match.gigId ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded breakdown */}
              {expandedId === match.gigId && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="border-t border-[rgb(var(--border))] p-5 bg-muted/30"
                >
                  <div className="space-y-2">
                    {[
                      { label: 'Skills', value: match.breakdown?.skillScore?.score ?? match.breakdown?.skillScore ?? 0, weight: '40%' },
                      { label: 'Semantic', value: match.breakdown?.semanticScore?.score ?? match.breakdown?.semanticScore ?? 0, weight: '35%' },
                      { label: 'Location', value: match.breakdown?.locationScore?.score ?? match.breakdown?.locationScore ?? 0, weight: '15%' },
                      { label: 'Salary', value: match.breakdown?.salaryScore?.score ?? match.breakdown?.salaryScore ?? 0, weight: '10%' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-xs w-20 text-muted-foreground">{item.label}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full', getMatchScoreBg(item.value))}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                        <span className={cn('text-xs font-medium w-10 text-right', getMatchScoreColor(item.value))}>
                          {Math.round(item.value)}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4">
                    {match.matchedSkills?.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {match.matchedSkills.map((s: string) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">{s}</span>
                        ))}
                      </div>
                    )}
                    {match.missingSkills?.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        {match.missingSkills.map((s: string) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-500">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
