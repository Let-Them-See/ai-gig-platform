'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'David Park',
    role: 'CTO, NeuralStack',
    initials: 'DP',
    type: 'client',
    rating: 5,
    quote: 'We found a BERT fine-tuning expert in 2 hours. The AI matching saved us weeks of searching. The escrow system gave us complete peace of mind.',
    gradient: 'from-brand-400 to-brand-600',
  },
  {
    name: 'Aisha Patel',
    role: 'ML Engineer',
    initials: 'AP',
    type: 'freelancer',
    rating: 5,
    quote: 'The AI proposal assistant is a game-changer. I write proposals 3x faster and my acceptance rate doubled. Already earned $15k in my first month.',
    gradient: 'from-accent-400 to-accent-600',
  },
  {
    name: 'James Wilson',
    role: 'VP Engineering, DataFlow',
    initials: 'JW',
    type: 'client',
    rating: 5,
    quote: 'Best platform for AI talent. We built an entire recommendation system through GigForge. The milestone-based payments kept everything on track.',
    gradient: 'from-success to-emerald-600',
  },
  {
    name: 'Nina Kowalski',
    role: 'Computer Vision Freelancer',
    initials: 'NK',
    type: 'freelancer',
    rating: 5,
    quote: 'Finally, a platform that understands AI work. The skill-based matching means I only see relevant gigs. Payments always arrive on time.',
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Robert Chang',
    role: 'CEO, AI Labs Inc.',
    initials: 'RC',
    type: 'client',
    rating: 5,
    quote: 'We hired 8 freelancers through GigForge for our chatbot project. Every single one was exceptional. The verification process really works.',
    gradient: 'from-orange-400 to-orange-600',
  },
];

export default function Testimonials() {
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
            Loved by Builders
          </motion.h2>
          <p className="mt-4 text-lg text-surface-800/60">
            Read what clients and freelancers are saying about GigForge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
            >
              <div className="card-elevated p-6 h-full flex flex-col">
                <Quote className="w-8 h-8 text-brand-200 mb-4" />
                <p className="text-surface-800/80 leading-relaxed flex-grow italic">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-1 my-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-surface-900">{t.name}</p>
                    <p className="text-xs text-surface-800/50">{t.role}</p>
                  </div>
                  <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium ${
                    t.type === 'client'
                      ? 'bg-brand-50 text-brand-600'
                      : 'bg-accent-300/10 text-accent-500'
                  }`}>
                    {t.type === 'client' ? 'Client' : 'Freelancer'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
