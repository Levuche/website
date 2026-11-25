import { cn } from '@/lib/utils';

/** First letters of up to two words: "Desi Origins" becomes "DO". */
export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * A round avatar: the picture when there is one, otherwise the initials.
 * Decorative by default, since a name is usually shown next to it.
 */
export function Avatar({
  name,
  src,
  size = 48,
  tone = 'brand',
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  tone?: 'brand' | 'accent';
  className?: string;
}) {
  const tones = {
    brand: 'bg-lv-brand text-lv-on-brand',
    accent: 'bg-lv-accent text-lv-on-accent',
  };
  const style = { width: size, height: size, fontSize: Math.round(size / 3) };
  if (src) {
    return (
      // A small avatar at a fixed size; next/image adds nothing here.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        style={style}
        className={cn('flex-none rounded-full object-cover', className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      style={style}
      className={cn(
        'inline-flex flex-none items-center justify-center rounded-full font-bold',
        tones[tone],
        className
      )}
    >
      {initials(name)}
    </span>
  );
}

/** Grey bars shown while something loads. */
export function Skeleton({ lines = 2 }: { lines?: number }) {
  return (
    <span aria-hidden className="flex flex-col gap-2">
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className="bg-lv-surface-2 block h-3.5 rounded-[7px]"
          style={{ width: `${i % 2 ? 45 : 70}%` }}
        />
      ))}
    </span>
  );
}
