'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-surface-900 px-8 py-16 lg:px-16 lg:py-20 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-brand-200 text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Start building today
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
              Ready to transform how you work with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-accent-300">
                AI talent?
              </span>
            </h2>

            <p className="mt-6 text-lg text-brand-100/70 max-w-xl mx-auto">
              Join thousands of companies and freelancers already building
              the future with GigForge.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-900 font-bold rounded-xl text-lg hover:bg-brand-50 transition-all shadow-xl hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/gigs"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl text-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Browse Gigs
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
