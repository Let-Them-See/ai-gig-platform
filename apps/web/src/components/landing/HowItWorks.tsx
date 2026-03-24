'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Cpu, CreditCard, Send, Sparkles, Wallet } from 'lucide-react';

const clientSteps = [
  {
    icon: FileText,
    title: 'Post Your Project',
    description: 'Describe what you need, set your budget and deadline. Our AI will optimize your listing.',
  },
  {
    icon: Cpu,
    title: 'Get AI-Matched',
    description: 'Our matching engine finds the top freelancers with verified skills for your project.',
  },
  {
    icon: CreditCard,
    title: 'Pay Securely',
    description: 'Funds held in escrow until you approve the work. Zero risk, full protection.',
  },
];

const freelancerSteps = [
  {
    icon: Send,
    title: 'Apply with AI Assist',
    description: 'Browse gigs matched to your skills. Use AI to craft winning proposals in seconds.',
  },
  {
    icon: Sparkles,
    title: 'AI Score Boost',
    description: 'Your skills get scored against each gig. Higher scores = more visibility to clients.',
  },
  {
    icon: Wallet,
    title: 'Get Paid Fast',
    description: 'Deliver the work, get approved, and receive payout directly to your bank within 48hrs.',
  },
];

export default function HowItWorks() {
  const [activeView, setActiveView] = useState<'client' | 'freelancer'>('client');
  const steps = activeView === 'client' ? clientSteps : freelancerSteps;

  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-surface-900"
          >
            How It Works
          </motion.h2>
          <p className="mt-4 text-lg text-surface-800/60">
            Simple, fast, and AI-powered from start to finish.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex bg-surface-100 rounded-xl p-1">
            <button
              onClick={() => setActiveView('client')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeView === 'client'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-surface-800/60 hover:text-surface-900'
              }`}
            >
              For Clients
            </button>
            <button
              onClick={() => setActiveView('freelancer')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeView === 'freelancer'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-surface-800/60 hover:text-surface-900'
              }`}
            >
              For Freelancers
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative"
              >
                <div className="card-elevated p-8 h-full text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white mb-6">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-surface-800/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
