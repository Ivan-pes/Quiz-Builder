'use client';

import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuizzesError({
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
    <div className="flex flex-col items-center rounded-xl border border-red-200 bg-white px-6 py-14 text-center">
      <TriangleAlert className="size-10 text-red-500" aria-hidden />
      <h2 className="mt-3 font-semibold">Could not load quizzes</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Make sure the backend is running and reachable, then try again.
      </p>
      <Button variant="secondary" className="mt-5" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  );
}
