'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Shield, Zap, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-pattern pt-20 pb-16 lg:pt-28 lg:pb-24">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0e9ff22_1px,transparent_1px),linear-gradient(to_bottom,#e0e9ff22_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="container-main relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-full text-brand-600 text-sm font-medium mb-6 border border-brand-100">
              <Sparkles className="w-4 h-4" />
              AI-Powered Matching
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 leading-tight tracking-tight">
              Where AI talent meets{' '}
              <span className="gradient-text">real work</span>
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-surface-800/70 max-w-xl leading-relaxed">
              Post AI/ML projects, get matched with verified engineers in 60
              seconds, pay securely with escrow.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/sign-up" className="btn-primary text-lg px-8 py-4">
                Post a Project
              </Link>
              <Link href="/gigs" className="btn-secondary text-lg px-8 py-4">
                Find AI Work
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-surface-800/60">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                <span>Escrow protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning" />
                <span>60s AI matching</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-brand-500" />
                <span>4.9/5 avg rating</span>
              </div>
            </div>
          </motion.div>

          {/* Right — Floating Profile Cards */}
          <div className="relative hidden lg:block h-[500px]">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute top-8 right-4 animate-float"
            >
              <div className="card-elevated p-5 w-72">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                    SA
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">Sarah A.</p>
                    <p className="text-sm text-surface-800/60">ML Engineer</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['PyTorch', 'NLP', 'LLMs'].map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-semibold">4.9</span>
                  </div>
                  <span className="text-sm text-surface-800/60">$120/hr</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute top-44 left-0 animate-float-delayed"
            >
              <div className="card-elevated p-5 w-64">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success to-brand-400 flex items-center justify-center text-white font-bold text-lg">
                    RK
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">Raj K.</p>
                    <p className="text-sm text-surface-800/60">
                      Data Scientist
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['TensorFlow', 'CV', 'MLOps'].map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-accent-300/10 text-accent-500 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Match badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute bottom-20 right-12"
            >
              <div className="glass p-4 shadow-xl animate-pulse-glow">
                <div className="text-center">
                  <p className="text-3xl font-bold gradient-text">94%</p>
                  <p className="text-xs text-surface-800/60 mt-1">
                    AI Match Score
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute bottom-4 left-12 animate-float"
            >
              <div className="card-elevated p-4 w-56">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warning to-error flex items-center justify-center text-white text-sm font-bold">
                    LM
                  </div>
                  <p className="font-semibold text-sm text-surface-900">
                    Lisa M.
                  </p>
                </div>
                <p className="text-xs text-surface-800/60">
                  AI Agent Developer
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-warning text-warning" />
                  <Star className="w-3 h-3 fill-warning text-warning" />
                  <Star className="w-3 h-3 fill-warning text-warning" />
                  <Star className="w-3 h-3 fill-warning text-warning" />
                  <Star className="w-3 h-3 fill-warning text-warning" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
