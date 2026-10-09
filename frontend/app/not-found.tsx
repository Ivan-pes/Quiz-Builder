import { SearchX } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <SearchX className="size-12 text-slate-400" aria-hidden />
      <h1 className="mt-4 text-2xl font-semibold">Not found</h1>
      <p className="mt-1 text-slate-500">
        The page or quiz you are looking for does not exist.
      </p>
      <ButtonLink href="/quizzes" variant="secondary" className="mt-6">
        Back to quizzes
      </ButtonLink>
    </div>
  );
}
