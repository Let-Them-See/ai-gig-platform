'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGig } from '@/lib/api';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'Web Development', 'AI/ML', 'Data Analytics', 'App Development',
  'Cloud Computing', 'Cybersecurity', 'NLP / Text AI', 'Computer Vision',
  'ML Engineering', 'Data Science', 'AI Integration', 'LLM Fine-tuning',
  'Chatbot Dev', 'Automation / Agents', 'DevOps', 'Design',
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Expert'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
const PAY_TYPES = ['Fixed Price', 'Hourly', 'Monthly'];

export default function NewGigPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[0]);
  const [jobType, setJobType] = useState(JOB_TYPES[0]);
  const [payType, setPayType] = useState(PAY_TYPES[0]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => createGig(data),
    onSuccess: () => {
      // Invalidate gigs cache so the new job shows up immediately everywhere
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard'] });
      router.push('/gigs');
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create gig. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.length < 5) {
      setError('Title must be at least 5 characters.');
      return;
    }
    if (description.length < 20) {
      setError('Description must be at least 20 characters.');
      return;
    }

    mutation.mutate({
      title,
      description,
      skills,
      category,
      experienceLevel,
      jobType,
      payType,
      location: location || undefined,
      isRemote,
      budgetMin: budgetMin ? parseFloat(budgetMin) : undefined,
      budgetMax: budgetMax ? parseFloat(budgetMax) : undefined,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/gigs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Gigs
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Post a New Job</h1>
        <p className="text-muted-foreground text-sm">Fill in the details below. Your job will be visible to freelancers immediately.</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-card border border-[rgb(var(--border))] rounded-2xl p-6 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Job Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build NLP pipeline for customer feedback analysis"
            className="w-full px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Description *</label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project in detail — what you need, deliverables, and timeline..."
            className="w-full px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-colors"
          />
        </div>

        {/* Category + Experience */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] focus:border-primary outline-none transition-colors"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] focus:border-primary outline-none transition-colors"
            >
              {EXPERIENCE_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        {/* Job Type + Pay Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] focus:border-primary outline-none transition-colors"
            >
              {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Pay Type</label>
            <select
              value={payType}
              onChange={(e) => setPayType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] focus:border-primary outline-none transition-colors"
            >
              {PAY_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Budget Min / Max */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Budget Min (₹)</label>
            <input
              type="number"
              min={0}
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="e.g. 25000"
              className="w-full px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Budget Max (₹)</label>
            <input
              type="number"
              min={0}
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="e.g. 75000"
              className="w-full px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Location + Remote */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, Bangalore"
              className="w-full px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                className="w-5 h-5 rounded accent-primary"
              />
              <span className="text-sm font-medium">Remote friendly</span>
            </label>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Required Skills</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a skill (e.g. Python, React)..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              className="flex-1 px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] hover:bg-primary/10 hover:border-primary/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map(s => (
                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/20">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter(sk => sk !== s))} className="hover:text-red-400 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-[rgb(var(--border))]">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 rounded-xl bg-muted border border-[rgb(var(--border))] text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 px-6 py-3 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish Job'
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
