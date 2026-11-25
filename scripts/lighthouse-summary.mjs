// Writes the Lighthouse scores of each page as a table, for the job summary.
// Usage: node scripts/lighthouse-summary.mjs [.lighthouseci/reports]
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = process.argv[2] || '.lighthouseci/reports';
const runs = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf8'));
const pct = (n) => (typeof n === 'number' ? Math.round(n * 100) : '–');

const rows = runs
  .filter((run) => run.isRepresentativeRun)
  .map(({ url, summary }) => {
    const path = new URL(url).pathname;
    return `| ${path} | ${pct(summary.performance)} | ${pct(summary.accessibility)} | ${pct(summary.seo)} | ${pct(summary['best-practices'])} |`;
  });

console.log(
  [
    '### Lighthouse (median of 3 runs, budget 90)',
    '',
    '| Page | Performance | Accessibility | SEO | Best practices |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
  ].join('\n')
);
