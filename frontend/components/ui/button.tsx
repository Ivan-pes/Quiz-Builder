import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500',
  secondary:
    'border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
};

export function buttonClassName(variant: Variant = 'primary', className = '') {
  return `${base} ${variants[variant]} ${className}`;
}

export function Button({
  variant,
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClassName(variant, className)} {...props} />;
}
