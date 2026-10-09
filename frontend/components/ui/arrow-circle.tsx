import { ArrowRight } from 'lucide-react';

/** Decorative round arrow used as the "open" affordance on cards and rows. */
export function ArrowCircle({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-10 shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-0.5 ${
        inverted ? 'bg-white text-neutral-950' : 'bg-neutral-950 text-white'
      }`}
    >
      <ArrowRight className="size-5" strokeWidth={2.25} />
    </span>
  );
}
