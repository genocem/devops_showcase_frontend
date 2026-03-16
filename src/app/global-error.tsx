'use client';

import { Button } from '@/components';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  console.error('Global application error:', error);

  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <main className="main-content">
            <div className="page-shell">
              <h1 className="page-title">Application error</h1>
              <p className="muted">
                The application hit an unexpected error. Please retry.
              </p>
              <Button onClick={reset}>Reload view</Button>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
