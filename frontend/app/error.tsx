'use client';

import { useEffect } from 'react';
import { CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-3xl bg-red-600 text-white">
        <CloudOff className="size-8" aria-hidden />
      </span>
      <h1 className="mt-4 text-xl font-semibold">Could not load quizzes</h1>
      <p className="mt-1 max-w-sm text-neutral-500">
        Make sure the backend is running and reachable, then try again.
      </p>
      <Button className="mt-6" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
