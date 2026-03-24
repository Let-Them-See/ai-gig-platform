'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { useSimpleAuth } from '@/components/providers/AuthProvider';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSimpleAuth();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        capture_pageview: false,
        capture_pageleave: true,
      });
    }
  }, []);

  useEffect(() => {
    if (user?.email) posthog.identify(user.email, { name: user.name, role: user.role });
    else posthog.reset();
  }, [user]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
