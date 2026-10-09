import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="animate-rise mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-4xl font-semibold tracking-tight break-words sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-neutral-600 sm:text-lg">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 text-xl font-medium tracking-tight sm:text-2xl">
      {children}
    </h2>
  );
}
