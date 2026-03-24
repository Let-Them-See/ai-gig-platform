'use client';

import { FileText, Clock, DollarSign, CheckCircle, XCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const proposals = [
  { id: '1', gig: 'Build RAG pipeline for legal document search', bidAmount: 4200, deliveryDays: 12, status: 'PENDING', aiScore: 0.94, date: '2024-03-10', client: 'NeuralStack' },
  { id: '2', gig: 'Fine-tune LLaMA 3 for customer support', bidAmount: 4800, deliveryDays: 18, status: 'ACCEPTED', aiScore: 0.88, date: '2024-03-08', client: 'AI Labs Inc' },
  { id: '3', gig: 'Computer vision model for defect detection', bidAmount: 3900, deliveryDays: 14, status: 'REJECTED', aiScore: 0.72, date: '2024-03-05', client: 'PixelAI' },
  { id: '4', gig: 'AI customer support chatbot', bidAmount: 3500, deliveryDays: 8, status: 'SHORTLISTED', aiScore: 0.91, date: '2024-03-12', client: 'SupportHero' },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  PENDING: { color: 'bg-yellow-50 text-warning', icon: Clock },
  ACCEPTED: { color: 'bg-green-50 text-success', icon: CheckCircle },
  REJECTED: { color: 'bg-red-50 text-error', icon: XCircle },
  SHORTLISTED: { color: 'bg-brand-50 text-brand-600', icon: Star },
};

export default function ProposalsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-surface-900">My Proposals</h1>

      <div className="card-elevated divide-y divide-surface-100">
        {proposals.map((p, i) => {
          const config = statusConfig[p.status];
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/dashboard/gigs/${p.id}`} className="flex items-center justify-between p-5 hover:bg-surface-50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-surface-900">{p.gig}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-surface-800/50">
                    <span>{p.client}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{p.deliveryDays} days</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{p.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-surface-900">${p.bidAmount.toLocaleString()}</p>
                    <p className="text-xs text-accent-500">AI: {Math.round(p.aiScore * 100)}% match</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${config.color}`}>
                    <config.icon className="w-3.5 h-3.5" />
                    {p.status}
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
