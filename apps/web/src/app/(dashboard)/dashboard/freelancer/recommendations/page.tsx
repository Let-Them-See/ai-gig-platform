'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface MatchJob {
  jobId: string;
  title: string;
  type: string;
  location: string;
  experienceLevel: string;
  payType: string;
  payAmountINR: number;
  category: string;
  underservedFocus: string;
  matchScore: number;
  matchedSkills: string[];
  requiredSkills: string[];
}

export default function FreelancerRecommendationsPage() {
  const [jobs, setJobs] = useState<MatchJob[]>([]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem('gigforge.freelancer.matches');
    if (stored) {
      try {
        setJobs(JSON.parse(stored) as MatchJob[]);
      } catch {
        setJobs([]);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Recommended Gigs for You</h1>
        <p className="text-sm text-surface-800/60 mt-1">
          Based on your resume, here are the best matching opportunities in INR from our curated dataset.
        </p>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-surface-800/60">
          No matches found yet. Try updating your resume with more skills, then run the analysis again.
        </p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.jobId}
              className="card-elevated p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h2 className="text-lg font-semibold text-surface-900">
                  {job.title}
                </h2>
                <p className="text-sm text-surface-800/60 mt-1">
                  {job.type} • {job.location} • {job.experienceLevel}
                </p>
                <p className="text-sm text-surface-800/60 mt-1">
                  Category: {job.category}
                </p>
                <p className="text-sm text-surface-800/60 mt-1">
                  Required skills: {job.requiredSkills.join(', ')}
                </p>
                {job.matchedSkills.length > 0 && (
                  <p className="text-sm text-success mt-1">
                    Matched skills: {job.matchedSkills.join(', ')}
                  </p>
                )}
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-semibold text-surface-900">
                  {job.payType} &mdash; {formatCurrency(job.payAmountINR)}
                </p>
                <p className="text-xs text-brand-600 font-medium">
                  Match score: {job.matchScore}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

