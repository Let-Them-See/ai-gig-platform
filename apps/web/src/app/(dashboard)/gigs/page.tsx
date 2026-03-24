'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchGigs } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Search, MapPin, Briefcase, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  'All', 'Web Development', 'AI/ML', 'Data Analytics', 'App Development',
  'Cloud Computing', 'Cybersecurity', 'Design', 'Content', 'DevOps',
];

const EXPERIENCE_LEVELS = ['All', 'Beginner', 'Intermediate', 'Expert'];

export default function GigsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [isRemote, setIsRemote] = useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['gigs', page, search, selectedCategory, selectedExperience, isRemote],
    queryFn: () =>
      fetchGigs({
        page,
        pageSize: 12,
        search: search || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        experienceLevel: selectedExperience !== 'All' ? selectedExperience : undefined,
        isRemote: isRemote !== 'all' ? isRemote : undefined,
      }),
  });

  const gigs = (data as any)?.items ?? [];
  const totalPages = (data as any)?.totalPages ?? 1;
  const total = (data as any)?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Gigs</h1>
        <p className="text-white/50 mt-1">{total} gigs available</p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="Search gigs by title or description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/30 focus:border-brand-violet/50 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setPage(1)}
          className="px-6 py-3 bg-gradient-to-r from-brand-violet to-brand-cyan text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          Search
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-64 shrink-0 space-y-6">
          {/* Category */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Category
            </h3>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1); }}
                  className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
                    selectedCategory === cat
                      ? 'bg-brand-violet/20 text-brand-violet border border-brand-violet/30'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Experience</h3>
            <div className="space-y-1.5">
              {EXPERIENCE_LEVELS.map((exp) => (
                <button
                  key={exp}
                  onClick={() => { setSelectedExperience(exp); setPage(1); }}
                  className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
                    selectedExperience === exp
                      ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Work Type */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Work Type</h3>
            <div className="space-y-2">
              {[
                { label: 'All', value: 'all' },
                { label: 'Remote Only', value: 'true' },
                { label: 'On-site Only', value: 'false' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                  <input
                    type="radio"
                    name="remote"
                    value={opt.value}
                    checked={isRemote === opt.value}
                    onChange={(e) => { setIsRemote(e.target.value); setPage(1); }}
                    className="accent-brand-violet"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Gig Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg">No gigs found matching your criteria</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {gigs.map((gig: any, i: number) => (
                <motion.div
                  key={gig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/gigs/${gig.id}`}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-brand-violet/30 transition group cursor-pointer h-full">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-brand-violet transition line-clamp-1">
                          {gig.title}
                        </h3>
                        <div className="flex gap-1.5 shrink-0 ml-2">
                          {gig.isRemote && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              📍 Remote
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Category + Experience + JobType badges */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {gig.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-violet/10 text-brand-violet border border-brand-violet/20">
                            {gig.category}
                          </span>
                        )}
                        {gig.experienceLevel && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {gig.experienceLevel}
                          </span>
                        )}
                        {gig.jobType && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                            {gig.jobType}
                          </span>
                        )}
                      </div>

                      <p className="text-white/50 text-sm mb-3 line-clamp-2">
                        {gig.description}
                      </p>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(gig.skills ?? []).slice(0, 4).map((skill: string) => (
                          <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-brand-cyan border border-white/10">
                            {skill}
                          </span>
                        ))}
                        {(gig.skills ?? []).length > 4 && (
                          <span className="text-xs px-2 py-0.5 text-white/30">
                            +{gig.skills.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-white/40">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {gig.location || 'Remote'}
                        </div>
                        {gig.budgetMin != null && (
                          <div className="font-semibold text-white/70">
                            {gig.payType ? `${gig.payType}: ` : '₹ '}
                            {formatCurrency(gig.budgetMin)}
                            {gig.budgetMax && gig.budgetMax !== gig.budgetMin && ` – ${formatCurrency(gig.budgetMax)}`}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-white/30">
                        Posted by {gig.client?.user?.name || gig.client?.companyName || 'Unknown'}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-white/60">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
