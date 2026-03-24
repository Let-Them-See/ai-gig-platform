'use client';

import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

const freelancers = [
  {
    name: 'Sarah Anderson',
    initials: 'SA',
    headline: 'Senior ML Engineer • Ex-Google',
    rating: 4.9,
    reviews: 47,
    skills: ['PyTorch', 'NLP', 'Transformers'],
    rate: 120,
    gradient: 'from-brand-400 to-accent-500',
  },
  {
    name: 'Raj Krishnan',
    initials: 'RK',
    headline: 'Computer Vision Specialist',
    rating: 5.0,
    reviews: 32,
    skills: ['TensorFlow', 'OpenCV', 'YOLO'],
    rate: 95,
    gradient: 'from-success to-teal-500',
  },
  {
    name: 'Emily Chen',
    initials: 'EC',
    headline: 'Data Science Lead',
    rating: 4.8,
    reviews: 61,
    skills: ['Python', 'Pandas', 'MLOps'],
    rate: 110,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Marcus Johnson',
    initials: 'MJ',
    headline: 'LLM Fine-tuning Expert',
    rating: 4.9,
    reviews: 28,
    skills: ['GPT', 'LangChain', 'RAG'],
    rate: 150,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    name: 'Lisa Mueller',
    initials: 'LM',
    headline: 'AI Agent Developer',
    rating: 4.7,
    reviews: 39,
    skills: ['CrewAI', 'AutoGPT', 'APIs'],
    rate: 130,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Alex Petrov',
    initials: 'AP',
    headline: 'MLOps & Deployment',
    rating: 4.8,
    reviews: 44,
    skills: ['Docker', 'K8s', 'AWS ML'],
    rate: 105,
    gradient: 'from-emerald-500 to-green-500',
  },
];

export default function FeaturedFreelancers() {
  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-surface-900"
          >
            Top AI Freelancers
          </motion.h2>
          <p className="mt-4 text-lg text-surface-800/60">
            Verified experts ready to build your next AI project.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {freelancers.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="snap-center flex-shrink-0 w-72"
            >
              <div className="card-elevated p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {f.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-surface-900">{f.name}</p>
                      <CheckCircle className="w-4 h-4 text-brand-500 fill-brand-50" />
                    </div>
                    <p className="text-xs text-surface-800/60">{f.headline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="text-sm font-semibold">{f.rating}</span>
                  <span className="text-xs text-surface-800/50">({f.reviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {f.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-surface-100 text-surface-800/80 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                  <span className="text-lg font-bold text-surface-900">${f.rate}<span className="text-sm font-normal text-surface-800/50">/hr</span></span>
                  <button className="px-4 py-2 bg-brand-50 text-brand-600 rounded-lg text-sm font-semibold hover:bg-brand-100 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
