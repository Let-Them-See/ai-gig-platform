'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, TrendingUp, IndianRupee, Clock } from 'lucide-react';

const stats = [
  { icon: Users, value: 2400, suffix: '+', label: 'AI Freelancers', pre: '' },
  { icon: TrendingUp, value: 98, suffix: '%', label: 'Satisfaction Rate', pre: '' },
  { icon: IndianRupee, value: 2.8, suffix: 'Cr+', label: 'Paid Out', pre: '₹' },
  { icon: Clock, value: 48, suffix: 'hr', label: 'Avg Delivery', pre: '' },
];

function AnimatedCounter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Number(current.toFixed(value % 1 === 0 ? 0 : 1)));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-3xl lg:text-4xl font-bold text-surface-900 font-display">
      {prefix}{value % 1 === 0 ? Math.floor(count) : count.toFixed(1)}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-16 bg-surface-50 border-y border-surface-200">
      <div className="container-main">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-500 mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <AnimatedCounter value={stat.value} prefix={stat.pre} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-surface-800/60 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
