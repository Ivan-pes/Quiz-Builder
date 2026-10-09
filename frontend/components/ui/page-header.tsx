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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight break-words sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
