import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100';

const variants: Record<Variant, string> = {
  primary: 'bg-neutral-950 text-white hover:bg-neutral-800',
  secondary: 'bg-white text-neutral-950 shadow-sm hover:bg-neutral-50',
  ghost: 'text-neutral-700 hover:bg-white/60 hover:text-neutral-950',
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
