'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Legacy Clerk-style route — redirect to the active register page
export default function SignUpPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/register'); }, [router]);
  return null;
}
