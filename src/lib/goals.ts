import { trackGoal } from '@buildbase/sdk/tracking';
import { buildbase } from '@/lib/buildbase-config';

/**
 * The steps from visit to sale, counted as goals in Buildbase Analytics
 * (console: Analytics > Overview > Goals). Sign-up, login, checkout and
 * payment are counted by Buildbase itself, so they are not sent here.
 */
export type Goal =
  | 'get_started' // a Get started button was pressed
  | 'pricing_view' // the pricing page was opened
  | 'buy_add_on' // a Buy button for the $9 page was pressed
  | 'contact_sent'; // the contact form sent a message

/** Counts a goal. Nothing is sent while web analytics is off. */
export function goal(name: Goal, props?: Record<string, string>) {
  if (!buildbase.analytics || typeof window === 'undefined') return;
  trackGoal(name, props);
}
