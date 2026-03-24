'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FreelancerResumePage() {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resumeText.trim()) return;

    try {
      setLoading(true);
      // Store locally so recommendations page can reuse it if needed
      window.localStorage.setItem('gigforge.freelancer.resumeText', resumeText);
      const res = await fetch('/api/freelancers/resume-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      if (!res.ok) {
        throw new Error('Failed to analyze resume');
      }
      const data = await res.json();
      window.sessionStorage.setItem(
        'gigforge.freelancer.matches',
        JSON.stringify(data.data ?? []),
      );
      router.push('/dashboard/freelancer/recommendations');
    } catch (err: any) {
      alert(err.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-surface-900">Upload / Paste Resume</h1>
      <p className="text-sm text-surface-800/60">
        Paste your resume text below. The platform will read your skills and recommend the best matching gigs in INR from our dataset.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={10}
          className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none focus:border-brand-500"
          placeholder="Paste your resume text here (skills, experience, tools, etc.)"
        />
        <button
          type="submit"
          disabled={loading || !resumeText.trim()}
          className="btn-primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume & Find Gigs'}
        </button>
      </form>
    </div>
  );
}

