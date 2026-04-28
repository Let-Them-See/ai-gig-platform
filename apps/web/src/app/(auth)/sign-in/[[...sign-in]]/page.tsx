'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Legacy Clerk-style route — redirect to the active login page
export default function SignInPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/login'); }, [router]);
  return null;
}
