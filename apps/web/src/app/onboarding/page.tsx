'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<'CLIENT' | 'FREELANCER' | null>(null);
  const [step, setStep] = useState(1);

  const handleComplete = async () => {
    // In production: call API to set role and onboarding status
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-hero-pattern flex items-center justify-center p-4">
      <div className="card-elevated p-8 lg:p-12 max-w-xl w-full">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-brand-500' : 'bg-surface-200'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 mb-2">
              Welcome to GigForge! 👋
            </h1>
            <p className="text-surface-800/60 mb-8">
              How do you plan to use the platform?
            </p>

            <div className="grid gap-4">
              <button
                onClick={() => setRole('CLIENT')}
                className={`flex items-center gap-4 p-6 rounded-xl border-2 text-left transition-all ${
                  role === 'CLIENT'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-surface-200 hover:border-brand-200'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-surface-900">
                    I want to hire AI talent
                  </p>
                  <p className="text-sm text-surface-800/60">
                    Post projects and find verified freelancers
                  </p>
                </div>
                {role === 'CLIENT' && (
                  <CheckCircle className="w-6 h-6 text-brand-500" />
                )}
              </button>

              <button
                onClick={() => setRole('FREELANCER')}
                className={`flex items-center gap-4 p-6 rounded-xl border-2 text-left transition-all ${
                  role === 'FREELANCER'
                    ? 'border-accent-500 bg-accent-300/5'
                    : 'border-surface-200 hover:border-accent-200'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-accent-300/10 text-accent-500 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-surface-900">
                    I want to find AI work
                  </p>
                  <p className="text-sm text-surface-800/60">
                    Browse gigs and offer your AI/ML expertise
                  </p>
                </div>
                {role === 'FREELANCER' && (
                  <CheckCircle className="w-6 h-6 text-accent-500" />
                )}
              </button>
            </div>

            <button
              onClick={() => role && setStep(2)}
              disabled={!role}
              className="btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-surface-800/60 mb-8">
              {role === 'CLIENT'
                ? 'Tell us about your company and what you need.'
                : 'Showcase your skills and experience.'}
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-surface-900 mb-1.5">
                  Headline
                </label>
                <input
                  type="text"
                  placeholder={
                    role === 'CLIENT'
                      ? 'e.g. CEO at TechStartup'
                      : 'e.g. Senior ML Engineer • NLP Specialist'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-900 mb-1.5">
                  Bio
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-900 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="btn-primary flex-1"
              >
                Complete Setup
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
