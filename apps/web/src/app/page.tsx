'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Sparkles, Zap, Shield, BarChart3, ArrowRight, Brain,
  Code2, Cpu, ChevronRight, Moon, Sun, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const stats = [
  { label: 'Active Gigs', value: '500+', icon: Zap },
  { label: 'AI Matches', value: '10K+', icon: Brain },
  { label: 'Success Rate', value: '94%', icon: BarChart3 },
  { label: 'Freelancers', value: '2K+', icon: Code2 },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    desc: 'TF-IDF + cosine similarity engine matches you to gigs by skill relevance, experience, and location.',
  },
  {
    icon: Shield,
    title: 'Bias-Free Scoring',
    desc: 'Transparent AI scoring with full breakdown — skills, semantics, location, and salary compatibility.',
  },
  {
    icon: Cpu,
    title: 'Smart Skill Gap Analysis',
    desc: 'Identifies missing skills and shows exactly what you need to unlock top-tier gigs.',
  },
  {
    icon: Sparkles,
    title: 'Escrow Payments',
    desc: 'Stripe Connect holds funds securely until work is approved. 10% platform fee, zero hassle.',
  },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden">
      {/* ── Navbar ────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[rgb(var(--background))]/80 border-b border-[rgb(var(--border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">GigForge</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/gigs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Gigs</Link>
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link href="/login" className="btn-secondary text-sm py-2 px-4">Log In</Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-[rgb(var(--border))] bg-[rgb(var(--background))]"
          >
            <div className="px-4 py-4 space-y-3">
              <Link href="/gigs" className="block text-sm py-2">Browse Gigs</Link>
              <Link href="/login" className="block btn-secondary w-full text-center">Log In</Link>
              <Link href="/register" className="block btn-primary w-full text-center">Get Started</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Freelance Marketplace
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight"
          >
            Find Your Perfect Gig
            <br />
            <span className="gradient-text">with AI</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            The two-sided marketplace where businesses post AI-related gigs and verified
            freelancers get matched, bid, and deliver work — powered by intelligent matching.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register" className="btn-primary text-base px-8 py-4 group">
              Get Started as Freelancer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/register" className="btn-secondary text-base px-8 py-4 group">
              Post a Job
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Section ────────────────────────────────── */}
      <section className="py-16 border-t border-b border-[rgb(var(--border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────── */}
      <section id="features" className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Why <span className="gradient-text">GigForge</span>?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for the AI/ML era. Every feature is designed to connect the right talent with the right opportunity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="group p-8 rounded-2xl bg-card border border-[rgb(var(--border))] card-hover"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4
                  group-hover:shadow-glow transition-shadow duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────── */}
      <section className="py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="p-12 rounded-3xl gradient-primary relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to forge your future?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of freelancers and clients already using AI-powered matching.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl
                  hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start for Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-[rgb(var(--border))] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold gradient-text">GigForge</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/gigs" className="hover:text-foreground transition-colors">Browse Gigs</Link>
              <Link href="/register" className="hover:text-foreground transition-colors">Sign Up</Link>
              <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 GigForge. Built to scale. 🚀
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
