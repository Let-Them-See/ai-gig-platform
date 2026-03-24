'use client';

import type React from 'react';
import { Toaster } from 'sonner';
import { PostHogProvider } from './PostHogProvider';
import { AuthProvider } from './AuthProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PostHogProvider>
        {children}
        <Toaster richColors position="bottom-right" />
      </PostHogProvider>
    </AuthProvider>
  );
}

