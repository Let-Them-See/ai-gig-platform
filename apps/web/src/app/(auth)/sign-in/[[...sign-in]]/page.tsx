'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/components/providers/AuthProvider';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useSimpleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const ok = signIn(email, password);
    if (!ok) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern px-4">
      <form onSubmit={handleSubmit} className="card-elevated w-full max-w-md p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Welcome Back</h1>
          <p className="text-sm text-surface-800/60 mt-1">Sign in to continue to your dashboard.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-surface-900">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-brand-500 outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-surface-900">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-brand-500 outline-none"
            placeholder="Enter password"
          />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <button type="submit" className="btn-primary w-full justify-center">
          Sign In
        </button>

        <p className="text-sm text-surface-800/60 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-brand-600 font-medium hover:text-brand-700">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
