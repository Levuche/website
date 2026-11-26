import Link from 'next/link';
import { cn } from '@/lib/utils';

/** The Levuche icon: amber bag with a check, on navy. */
export function LevucheIcon({
  size = 40,
  className,
  title = 'Levuche',
}: {
  size?: number;
  className?: string;
  /** Accessible name; pass '' when text next to it already names it. */
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      {...(title
        ? { role: 'img', 'aria-label': title }
        : { 'aria-hidden': true })}
    >
      <rect width="512" height="512" rx="116" fill="#24257A" />
      <g transform="translate(0 -26)">
        <path
          d="M190 204 C190 140 322 140 322 204"
          fill="none"
          stroke="#FFB627"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M170 190 H342 Q370 190 373 218 L384 342 Q387 384 345 384 H240 L176 432 L188 384 H167 Q125 384 128 342 L139 218 Q142 190 170 190 Z"
          fill="#FFB627"
        />
        <path
          d="M204 290 L244 328 L310 254"
          fill="none"
          stroke="#24257A"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** Icon plus the lowercase wordmark, linking home. */
export function LevucheLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'text-lv-text flex items-center gap-2 no-underline',
        className
      )}
    >
      <LevucheIcon size={32} title="" />
      <span className="text-logo">levuche</span>
      <span className="sr-only">home</span>
    </Link>
  );
}
