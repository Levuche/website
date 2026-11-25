import localFont from 'next/font/local';

/** Sora, the Levuche typeface (SIL OFL 1.1, see src/fonts/OFL.txt). */
export const sora = localFont({
  src: [
    { path: '../fonts/Sora-400.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/Sora-600.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/Sora-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-sora',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});
