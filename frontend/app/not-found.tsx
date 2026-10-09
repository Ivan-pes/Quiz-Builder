import { SearchX } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-3xl bg-neutral-950 text-white">
        <SearchX className="size-8" aria-hidden />
      </span>
      <h1 className="mt-4 text-2xl font-semibold">Not found</h1>
      <p className="mt-1 text-neutral-500">
        The page or quiz you are looking for does not exist.
      </p>
      <ButtonLink href="/quizzes" className="mt-6">
        Back to quizzes
      </ButtonLink>
    </div>
  );
}
