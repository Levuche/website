#!/usr/bin/env node
/**
 * Builds the site for Cloudflare Workers (OpenNext). Run by `npm run cf:build`
 * and by Workers Builds (docs/DEPLOY.md).
 *
 * Workers Builds gives every branch the same build variables, but NEXT_PUBLIC_*
 * values are baked into the build. So on any branch other than the production
 * branch, each build variable named PREVIEW_<NAME> replaces <NAME>, and
 * NEXT_PUBLIC_SITE_ENV is set to "preview" so the build sends noindex.
 * Values are never printed.
 */
import { spawnSync } from 'node:child_process';

const env = { ...process.env };
const branch = env.WORKERS_CI_BRANCH?.trim();
const productionBranch = env.PRODUCTION_BRANCH?.trim() || 'main';

if (branch && branch !== productionBranch) {
  const replaced = [];
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('PREVIEW_') && key.length > 'PREVIEW_'.length) {
      env[key.slice('PREVIEW_'.length)] = value;
      replaced.push(key.slice('PREVIEW_'.length));
    }
  }
  env.NEXT_PUBLIC_SITE_ENV = 'preview';
  console.log(
    `Preview build for branch "${branch}". Preview values used for: ${
      replaced.length ? replaced.sort().join(', ') : 'none'
    }.`
  );
} else if (branch) {
  console.log(`Production build for branch "${branch}".`);
}

const result = spawnSync('npx', ['opennextjs-cloudflare', 'build'], {
  env,
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
