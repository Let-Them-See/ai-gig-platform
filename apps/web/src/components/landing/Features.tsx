'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageSquare, Eye, Cpu, BarChart3, Settings, Brain, Bot, Workflow } from 'lucide-react';

const categories = [
  { name: 'NLP / Text AI', icon: MessageSquare, gigCount: 340, avgBudget: 2800, color: 'from-blue-500 to-cyan-500' },
  { name: 'Computer Vision', icon: Eye, gigCount: 280, avgBudget: 3200, color: 'from-purple-500 to-pink-500' },
  { name: 'ML Engineering', icon: Cpu, gigCount: 420, avgBudget: 4500, color: 'from-brand-500 to-accent-500' },
  { name: 'Data Science', icon: BarChart3, gigCount: 510, avgBudget: 2400, color: 'from-green-500 to-emerald-500' },
  { name: 'AI Integration', icon: Settings, gigCount: 190, avgBudget: 3800, color: 'from-orange-500 to-amber-500' },
  { name: 'LLM Fine-tuning', icon: Brain, gigCount: 260, avgBudget: 5000, color: 'from-violet-500 to-purple-500' },
  { name: 'Chatbot Dev', icon: Bot, gigCount: 380, avgBudget: 2100, color: 'from-teal-500 to-cyan-500' },
  { name: 'Automation / Agents', icon: Workflow, gigCount: 210, avgBudget: 4200, color: 'from-rose-500 to-red-500' },
];

export default function Features() {
  return (
    <section className="section-padding bg-surface-50">
      <div className="container-main">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-surface-900"
          >
            Explore AI Categories
          </motion.h2>
          <p className="mt-4 text-lg text-surface-800/60">
            Find the perfect gig in every corner of AI and machine learning.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link href={`/gigs?category=${cat.name.toLowerCase().replace(/[\s/]+/g, '-')}`}>
                <div className="card-elevated p-6 h-full group cursor-pointer hover:border-brand-200">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-surface-900 mb-1">{cat.name}</h3>
                  <p className="text-sm text-surface-800/60">
                    {cat.gigCount} gigs • Avg ${(cat.avgBudget / 1000).toFixed(1)}k
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
