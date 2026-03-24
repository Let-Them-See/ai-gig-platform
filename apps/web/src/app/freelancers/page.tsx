'use client';

import { Search, Star, CheckCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const freelancers = [
  { id: '1', name: 'Sarah Anderson', initials: 'SA', headline: 'Senior ML Engineer • Ex-Google', rating: 4.9, reviews: 47, skills: ['PyTorch', 'NLP', 'Transformers', 'LangChain'], rate: 120, location: 'San Francisco, CA', gradient: 'from-brand-400 to-accent-500', completedGigs: 32 },
  { id: '2', name: 'Raj Krishnan', initials: 'RK', headline: 'Computer Vision Specialist', rating: 5.0, reviews: 32, skills: ['TensorFlow', 'OpenCV', 'YOLO', 'PyTorch'], rate: 95, location: 'Bangalore, India', gradient: 'from-success to-teal-500', completedGigs: 28 },
  { id: '3', name: 'Emily Chen', initials: 'EC', headline: 'Data Science Lead', rating: 4.8, reviews: 61, skills: ['Python', 'Pandas', 'MLOps', 'Spark'], rate: 110, location: 'New York, NY', gradient: 'from-purple-500 to-pink-500', completedGigs: 45 },
  { id: '4', name: 'Marcus Johnson', initials: 'MJ', headline: 'LLM Fine-tuning Expert', rating: 4.9, reviews: 28, skills: ['GPT', 'LangChain', 'RAG', 'LoRA'], rate: 150, location: 'London, UK', gradient: 'from-orange-500 to-red-500', completedGigs: 19 },
  { id: '5', name: 'Lisa Mueller', initials: 'LM', headline: 'AI Agent Developer', rating: 4.7, reviews: 39, skills: ['CrewAI', 'AutoGPT', 'APIs', 'Python'], rate: 130, location: 'Berlin, Germany', gradient: 'from-cyan-500 to-blue-500', completedGigs: 24 },
  { id: '6', name: 'Alex Petrov', initials: 'AP', headline: 'MLOps & Deployment', rating: 4.8, reviews: 44, skills: ['Docker', 'K8s', 'AWS ML', 'Terraform'], rate: 105, location: 'Toronto, Canada', gradient: 'from-emerald-500 to-green-500', completedGigs: 36 },
];

export default function FreelancersPage() {
  return (
    <main>
      <Navbar />
      <div className="section-padding bg-hero-pattern">
        <div className="container-main">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-surface-900">Find AI Freelancers</h1>
            <p className="text-surface-800/60 mt-3">Browse verified AI and ML experts ready for your next project.</p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-800/40" />
              <input type="text" placeholder="Search by skill, name, or specialty..." className="w-full pl-12 pr-4 py-4 rounded-2xl border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none shadow-lg shadow-black/5" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((f, i) => (
              <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/freelancers/${f.id}`}>
                  <div className="card-elevated p-6 h-full hover:border-brand-200 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {f.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-surface-900">{f.name}</p>
                          <CheckCircle className="w-4 h-4 text-brand-500" />
                        </div>
                        <p className="text-xs text-surface-800/60">{f.headline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-surface-800/50 mb-3">
                      <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-warning text-warning" /> {f.rating} ({f.reviews})</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {f.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {f.skills.map(skill => <span key={skill} className="px-2.5 py-1 bg-surface-100 text-surface-800/70 rounded-lg text-xs font-medium">{skill}</span>)}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                      <span className="text-lg font-bold text-surface-900">${f.rate}<span className="text-sm font-normal text-surface-800/50">/hr</span></span>
                      <span className="text-xs text-surface-800/50">{f.completedGigs} gigs done</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
