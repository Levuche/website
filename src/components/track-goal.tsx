'use client';

import { useEffect } from 'react';
import { goal, type Goal } from '@/lib/goals';

/** Counts a goal once when the page it sits on is opened. */
export function TrackGoal({ name }: { name: Goal }) {
  useEffect(() => {
    goal(name);
  }, [name]);
  return null;
}
