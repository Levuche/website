import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/*
 * tailwind-merge has to know the size presets in src/app/globals.css (and the
 * ones @levuche/ui shares), or it reads text-h1 as a colour and drops the
 * real colour next to it. Keep these lists in step with the @theme blocks.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display',
        'h1',
        'h2',
        'h3',
        'h4',
        'lead',
        'body',
        'ui',
        'caption',
        'price',
        'logo',
      ],
      spacing: [
        'gutter',
        'section',
        'hero',
        'card',
        'split',
        'control-sm',
        'control-md',
        'control-lg',
      ],
      container: [
        'layout',
        'content',
        'article',
        'form',
        'narrow',
        'measure',
        'page',
        'page-wide',
      ],
      radius: ['tile', 'card', 'panel', 'device'],
      shadow: ['lift'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
