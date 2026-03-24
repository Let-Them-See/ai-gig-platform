'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth, type UserRole } from '@/components/providers/AuthProvider';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useSimpleAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('FREELANCER');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const ok = signUp(name, email, password, role);
    if (!ok) {
      setError('This email is already registered. Please sign in instead.');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern px-4">
      <form onSubmit={handleSubmit} className="card-elevated w-full max-w-md p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Create Your Account</h1>
          <p className="text-sm text-surface-800/60 mt-1">Simple setup for your college project demo.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-surface-900">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-brand-500 outline-none"
            placeholder="Your name"
          />
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
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-brand-500 outline-none"
            placeholder="At least 6 characters"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-surface-900">I am joining as</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-brand-500 outline-none bg-white"
          >
            <option value="FREELANCER">Freelancer</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <button type="submit" className="btn-primary w-full justify-center">
          Create Account
        </button>

        <p className="text-sm text-surface-800/60 text-center">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-brand-600 font-medium hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
