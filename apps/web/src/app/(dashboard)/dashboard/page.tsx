'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { fetchFreelancerDashboard, fetchClientDashboard } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  ClipboardList, TrendingUp, FileText, Sparkles,
  Briefcase, Users, BarChart3, Trophy
} from 'lucide-react';
import { cn, getMatchScoreColor } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const CHART_COLORS = ['#6C63FF', '#22D3EE', '#10B981', '#EF4444'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'CLIENT') return <ClientDashboard />;
  return <FreelancerDashboard />;
}

function FreelancerDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['freelancer-dashboard'],
    queryFn: fetchFreelancerDashboard,
  });

  if (isLoading) return <DashboardSkeleton />;

  const stats = [
    { label: 'Applications Sent', value: data?.totalApplications ?? 0, icon: ClipboardList, color: 'text-primary' },
    { label: 'Avg Match Score', value: `${data?.averageMatchScore ?? 0}%`, icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Resume Score', value: `${data?.resumeCompleteness ?? 0}%`, icon: FileText, color: 'text-amber-500' },
    { label: 'Top Skills', value: data?.topSkills?.length ?? 0, icon: Sparkles, color: 'text-secondary' },
  ];

  const statusData = data?.statusBreakdown
    ? Object.entries(data.statusBreakdown).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back! 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your freelancer overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i}
            className="bg-card border border-[rgb(var(--border))] rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-muted', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Application Status Breakdown */}
      {statusData.length > 0 && (
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="bg-card border border-[rgb(var(--border))] rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Application Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {statusData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-muted-foreground">{item.name}: {item.value as number}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ClientDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['client-dashboard'],
    queryFn: fetchClientDashboard,
  });

  if (isLoading) return <DashboardSkeleton />;

  const stats = [
    { label: 'Total Gigs', value: data?.totalGigs ?? 0, icon: Briefcase, color: 'text-primary' },
    { label: 'Total Applicants', value: data?.totalApplicants ?? 0, icon: Users, color: 'text-secondary' },
    { label: 'Hiring Rate', value: `${data?.hiringRate ?? 0}%`, icon: BarChart3, color: 'text-emerald-500' },
    { label: 'Top Candidates', value: data?.topCandidates?.length ?? 0, icon: Trophy, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Client Dashboard 📊</h1>
        <p className="text-muted-foreground mt-1">Manage your gigs and candidates</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i}
            className="bg-card border border-[rgb(var(--border))] rounded-2xl p-6 card-hover"
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-muted mb-4', stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Applicants Over Time Chart */}
      {data?.applicantsOverTime && data.applicantsOverTime.length > 0 && (
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="bg-card border border-[rgb(var(--border))] rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Applicants Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.applicantsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="date" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#6C63FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Top Candidates */}
      {data?.topCandidates && data.topCandidates.length > 0 && (
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="bg-card border border-[rgb(var(--border))] rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Top Candidates by Match Score</h3>
          <div className="space-y-3">
            {data.topCandidates.map((c: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium">{c.freelancer?.user?.name ?? 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{c.gigTitle}</p>
                </div>
                <span className={cn('font-bold text-lg', getMatchScoreColor(c.matchScore))}>
                  {c.matchScore}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-card border border-[rgb(var(--border))] rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-card border border-[rgb(var(--border))] rounded-2xl animate-pulse" />
    </div>
  );
}
