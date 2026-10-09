import { QUESTION_TYPES } from '@/lib/question-types';

/** Overlapping coloured circles, one per supported question type. */
export function TypeCircles() {
  return (
    <div className="flex">
      {QUESTION_TYPES.map(({ value, label, icon: Icon, dot }) => (
        <span
          key={value}
          title={label}
          className={`-ml-2 grid size-10 place-items-center rounded-full text-white ring-3 ring-white first:ml-0 ${dot}`}
        >
          <Icon className="size-5" aria-hidden />
        </span>
      ))}
    </div>
  );
}
