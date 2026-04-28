'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { uploadResume } from '@/lib/api';
import { formatCurrency, getMatchScoreColor } from '@/lib/utils';
import { Upload, FileText, Sparkles, CheckCircle2, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function ResumePage() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<any>(null);

  const uploadMutation = useMutation({
    mutationFn: (f: File) => uploadResume(f),
    onSuccess: (data: any) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err: Error) => alert(err.message),
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') {
      setFile(f);
      uploadMutation.mutate(f);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      uploadMutation.mutate(f);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="w-8 h-8 text-brand-violet" /> Resume Upload
        </h1>
        <p className="text-white/50 mt-1">Upload your resume and get AI-powered job recommendations</p>
      </div>

      {/* Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer ${
          dragOver ? 'border-brand-violet bg-brand-violet/5' : 'border-white/10 hover:border-white/20'
        }`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-white/30" />
        <p className="text-lg mb-1">{file ? file.name : 'Drop your resume here or click to browse'}</p>
        <p className="text-sm text-white/40">PDF files only</p>
        <input id="file-input" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
      </div>

      {uploadMutation.isPending && (
        <div className="flex items-center justify-center py-8 gap-3">
          <div className="animate-spin w-6 h-6 border-2 border-brand-violet border-t-transparent rounded-full" />
          <span className="text-white/50">Analyzing your resume with AI...</span>
        </div>
      )}

      {result && (
        <>
          {/* Extracted Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-cyan" /> Extracted Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.skills?.map((skill: string) => (
                <span key={skill} className="px-3 py-1 rounded-full text-sm bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                  {skill}
                </span>
              ))}
            </div>
            {result.skills?.length === 0 && (
              <p className="text-white/40 text-sm">No skills could be extracted. Try uploading a more detailed resume.</p>
            )}
          </motion.div>

          {/* Text Preview */}
          {result.textPreview && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3">Resume Preview</h2>
              <p className="text-sm text-white/60 whitespace-pre-wrap font-mono leading-relaxed">{result.textPreview}...</p>
            </motion.div>
          )}

          {/* AI Recommended Jobs */}
          {result.recommendedJobs?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-brand-violet" /> AI Recommended Jobs
              </h2>
              <p className="text-sm text-white/40 mb-4">Based on your resume skills, here are the best matches from our dataset</p>

              <div className="space-y-3">
                {result.recommendedJobs.map((job: any, idx: number) => (
                  <motion.div
                    key={job.gigId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/gigs/${job.gigId}`}>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-brand-violet/30 transition cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-mono text-white/30">#{idx + 1}</span>
                              <h3 className="font-semibold">{job.title}</h3>
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {job.category && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-violet/10 text-brand-violet">{job.category}</span>
                              )}
                              {job.experienceLevel && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">{job.experienceLevel}</span>
                              )}
                              {job.jobType && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan">{job.jobType}</span>
                              )}
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {job.matchedSkills?.map((s: string) => (
                                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">✓ {s}</span>
                              ))}
                              {job.missingSkills?.slice(0, 3).map((s: string) => (
                                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">✗ {s}</span>
                              ))}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-white/40">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location || 'Remote'}</span>
                              {job.budgetMin != null && (
                                <span>{job.payType}: {formatCurrency(job.budgetMin)}</span>
                              )}
                              {job.client?.companyName && (
                                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.client.companyName}</span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 ml-4 text-center">
                            <span className={`text-2xl font-bold ${getMatchScoreColor(job.totalScore)}`}>{job.totalScore}</span>
                            <p className="text-xs text-white/40">Match</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
