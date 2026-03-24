'use client';

import { motion } from 'framer-motion';
import { TrendingUp, IndianRupee, Briefcase, Star } from 'lucide-react';

export default function AnalyticsPage() {
  const monthlyData = [
    { month: 'Oct', earnings: 1800 },
    { month: 'Nov', earnings: 3200 },
    { month: 'Dec', earnings: 2100 },
    { month: 'Jan', earnings: 4500 },
    { month: 'Feb', earnings: 3800 },
    { month: 'Mar', earnings: 5200 },
  ];

  const maxEarning = Math.max(...monthlyData.map(d => d.earnings));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: '₹17.2L', icon: IndianRupee, change: '+12%', color: 'bg-green-50 text-success' },
          { label: 'Gigs Completed', value: '18', icon: Briefcase, change: '+3', color: 'bg-brand-50 text-brand-600' },
          { label: 'Avg Rating', value: '4.9', icon: Star, change: '+0.1', color: 'bg-warning/10 text-warning' },
          { label: 'Response Rate', value: '94%', icon: TrendingUp, change: '+5%', color: 'bg-accent-300/10 text-accent-500' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-elevated p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}><stat.icon className="w-5 h-5" /></div>
              <span className="text-xs font-medium text-success">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
            <p className="text-sm text-surface-800/60">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="card-elevated p-6">
        <h2 className="text-lg font-semibold text-surface-900 mb-6">Earnings (Last 6 Months)</h2>
        <div className="flex items-end gap-4 h-64">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-surface-800/60">₹{(d.earnings * 83 / 1000).toFixed(0)}k</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.earnings / maxEarning) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-accent-400 min-h-[4px]"
              />
              <span className="text-xs text-surface-800/50">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
