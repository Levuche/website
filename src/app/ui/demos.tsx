'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmailSignup, TextField } from '@/components/ui/field';
import { SegmentedControl, Tabs } from '@/components/ui/tabs';

/** Buttons that change state when pressed, for the tests. */
export function ButtonDemo() {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button loading={busy} onClick={() => setBusy(true)}>
        {busy ? 'Publishing' : 'Publish'}
      </Button>
      <Button variant="secondary" onClick={() => setBusy(false)}>
        Reset
      </Button>
    </div>
  );
}

/** The Handle field from the Molecules board, checked as you type. */
export function HandleFieldDemo() {
  const [value, setValue] = useState('desiorigins');
  const error = /\s/.test(value)
    ? `Spaces aren’t allowed. Try ${value.trim().replace(/\s+/g, '-')}.`
    : undefined;
  return (
    <TextField
      label="Handle"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      hint={`Your site: ${value || 'yourname'}.levuche.page`}
      error={error}
    />
  );
}

export function EmailSignupDemo() {
  const [sent, setSent] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <EmailSignup
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSent(String(data.get('email')));
        }}
      />
      {sent ? (
        <p role="status" className="text-lv-text-2 m-0 text-sm">
          Signed up {sent}
        </p>
      ) : null}
    </div>
  );
}

export function TabsDemo() {
  return (
    <Tabs
      label="Inbox"
      items={[
        {
          id: 'contact',
          label: 'Contact',
          count: 4,
          panel: 'Contact messages',
        },
        {
          id: 'newsletter',
          label: 'Newsletter',
          count: 213,
          panel: 'Newsletter subscribers',
        },
        { id: 'waitlist', label: 'Waitlist', count: 38, panel: 'Waitlist' },
      ]}
    />
  );
}

export function SegmentedDemo() {
  const [size, setSize] = useState('phone');
  return (
    <div className="flex flex-col gap-2">
      <SegmentedControl
        label="Preview size"
        value={size}
        onChange={setSize}
        options={[
          { value: 'phone', label: 'Phone' },
          { value: 'tablet', label: 'Tablet' },
          { value: 'desktop', label: 'Desktop' },
        ]}
      />
      <p className="text-lv-text-3 m-0 text-[13px]">Showing: {size}</p>
    </div>
  );
}
