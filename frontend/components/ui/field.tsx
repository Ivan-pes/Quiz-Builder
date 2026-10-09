export function inputClassName(invalid = false, className = '') {
  return `w-full rounded-2xl border bg-white px-4 py-2.5 text-neutral-950 placeholder:text-neutral-400 focus:ring-4 focus:outline-none ${
    invalid
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-neutral-200 focus:border-neutral-950 focus:ring-neutral-950/10'
  } ${className}`;
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}
