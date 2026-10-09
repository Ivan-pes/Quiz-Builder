export function inputClassName(invalid = false, className = '') {
  return `w-full rounded-lg border bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:outline-none ${
    invalid
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
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
