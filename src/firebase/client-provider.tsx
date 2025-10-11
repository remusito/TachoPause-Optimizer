'use client';

import { FirebaseProvider } from '@/firebase';
import { useMemo, type ReactNode } from 'react';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => ({}), []);
  
  return <FirebaseProvider value={value}>{children}</FirebaseProvider>;
}
