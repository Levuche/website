'use client';

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export type TabItem = {
  id: string;
  label: ReactNode;
  /** A count after the label, such as unread messages. */
  count?: number;
  panel: ReactNode;
};

/**
 * Tabs (Molecules board). Follows the WAI-ARIA tabs pattern: arrow keys,
 * Home and End move between tabs, and only the selected tab is in the tab
 * order.
 */
export function Tabs({
  label,
  items,
  defaultTab,
  onChange,
  className,
}: {
  /** Accessible name of the tab list. */
  label: string;
  items: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}) {
  const base = useId();
  const [selected, setSelected] = useState(defaultTab ?? items[0]?.id);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const item = items[index];
    if (!item) return;
    setSelected(item.id);
    onChange?.(item.id);
    refs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    const next: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (event.key in next) {
      event.preventDefault();
      select(next[event.key]);
    }
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="border-lv-border flex gap-6 overflow-x-auto border-b"
      >
        {items.map((item, index) => {
          const isSelected = item.id === selected;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${item.id}`}
              aria-selected={isSelected}
              aria-controls={`${base}-panel-${item.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'min-h-11 flex-none cursor-pointer border-0 border-b-[3px] bg-transparent px-0 py-2.5 font-[inherit] text-[15px]',
                isSelected
                  ? 'border-lv-primary text-lv-text font-semibold'
                  : 'text-lv-text-2 border-transparent'
              )}
            >
              {item.label}
              {item.count !== undefined ? (
                <span className="text-lv-text-3 ms-1.5 tabular-nums">
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-panel-${item.id}`}
          aria-labelledby={`${base}-tab-${item.id}`}
          hidden={item.id !== selected}
          tabIndex={0}
          className="pt-4"
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}

/**
 * Segmented control (Molecules board): a small group of toggle buttons where
 * exactly one is pressed, such as Phone, Tablet, Desktop.
 */
export function SegmentedControl({
  label,
  options,
  value,
  defaultValue,
  onChange,
  className,
}: {
  label: string;
  options: { value: string; label: ReactNode }[];
  /** Set it to control the choice from outside; leave it out otherwise. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const [own, setOwn] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? own;
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'bg-lv-surface-2 inline-flex gap-1 self-start rounded-xl p-1',
        className
      )}
    >
      {options.map((option) => {
        const pressed = option.value === current;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => {
              setOwn(option.value);
              onChange?.(option.value);
            }}
            className={cn(
              'min-h-10 cursor-pointer rounded-[9px] border-0 px-3.5 font-[inherit] text-[13px]',
              pressed
                ? 'bg-lv-card text-lv-text font-semibold'
                : 'text-lv-text-2 bg-transparent'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
