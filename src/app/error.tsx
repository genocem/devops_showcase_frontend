'use client';

import { useEffect } from 'react';
import { Button } from '@/components';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Unhandled page error:', error);
  }, [error]);

  return (
    <div className="page-shell">
      <h1 className="page-title">Something went wrong</h1>
      <p className="muted">
        An unexpected frontend exception occurred. You can retry the action.
      </p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
