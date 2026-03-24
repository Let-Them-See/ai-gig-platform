'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

const categoryOptions = [
  'NLP / Text AI', 'Computer Vision', 'ML Engineering', 'Data Science',
  'AI Integration', 'LLM Fine-tuning', 'Chatbot Dev', 'Automation / Agents',
];

export default function NewGigPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production: call POST /api/gigs
    router.push('/dashboard/gigs');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/dashboard/gigs" className="inline-flex items-center gap-2 text-sm text-surface-800/60 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4" /> Back to Gigs
      </Link>

      <h1 className="text-2xl font-bold text-surface-900">Post a New Gig</h1>

      <form onSubmit={handleSubmit} className="card-elevated p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-surface-900 mb-1.5">Title</label>
          <input type="text" required placeholder="e.g. Build NLP pipeline for customer feedback analysis"
            className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-900 mb-1.5">Description</label>
          <textarea rows={6} required placeholder="Describe your project in detail..."
            className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-900 mb-1.5">Requirements</label>
          <textarea rows={4} placeholder="List specific skills and experience needed..."
            className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-1.5">Category</label>
            <select className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 outline-none bg-white">
              {categoryOptions.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-1.5">Experience Level</label>
            <select className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 outline-none bg-white">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-1.5">Budget ($)</label>
            <input type="number" required placeholder="4500" min={1}
              className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-1.5">Budget Type</label>
            <select className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 outline-none bg-white">
              <option value="FIXED">Fixed Price</option>
              <option value="HOURLY">Hourly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-1.5">Deadline</label>
            <input type="date"
              className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-900 mb-1.5">Skills</label>
          <div className="flex gap-2">
            <input type="text" placeholder="Add a skill..." value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="flex-1 px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none" />
            <button type="button" onClick={addSkill} className="btn-secondary px-4"><Plus className="w-5 h-5" /></button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map(s => (
                <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-sm font-medium">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter(sk => sk !== s))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-surface-200">
          <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">Publish Gig</button>
        </div>
      </form>
    </div>
  );
}
