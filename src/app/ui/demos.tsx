'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

/** Buttons that change state when pressed, for the tests. */
export function ButtonDemo() {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button loading={busy} onClick={() => setBusy(true)}>
        {busy ? 'Publishing' : 'Publish'}
      </Button>
      <Button variant="outline" onClick={() => setBusy(false)}>
        Reset
      </Button>
    </div>
  );
}

/** The Handle field from the Molecules board, checked as you type. */
export function HandleFieldDemo() {
  const id = useId();
  const [value, setValue] = useState('desiorigins');
  const error = /\s/.test(value)
    ? `Spaces aren’t allowed. Try ${value.trim().replace(/\s+/g, '-')}.`
    : undefined;
  return (
    <Field>
      <FieldLabel htmlFor={id}>Handle</FieldLabel>
      <Input
        id={id}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-note`}
      />
      {error ? (
        <FieldError id={`${id}-note`}>{error}</FieldError>
      ) : (
        <FieldDescription id={`${id}-note`}>
          Your site: {value || 'yourname'}.levuche.page
        </FieldDescription>
      )}
    </Field>
  );
}

/** Email signup: a pill input and button on one row that wraps. */
export function EmailSignupDemo() {
  const id = useId();
  const [sent, setSent] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <form
        className="flex flex-wrap gap-2.5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSent(String(data.get('email')));
        }}
      >
        <label htmlFor={id} className="sr-only">
          Email
        </label>
        <Input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className="flex-[1_1_200px] rounded-full px-4"
        />
        <Button type="submit" variant="accent">
          Join the beta
        </Button>
      </form>
      {sent ? (
        <p role="status" className="text-lv-text-2 m-0 text-sm">
          Signed up {sent}
        </p>
      ) : null}
    </div>
  );
}

const INBOX = [
  { id: 'contact', label: 'Contact', count: 4, panel: 'Contact messages' },
  {
    id: 'newsletter',
    label: 'Newsletter',
    count: 213,
    panel: 'Newsletter subscribers',
  },
  { id: 'waitlist', label: 'Waitlist', count: 38, panel: 'Waitlist' },
];

export function TabsDemo() {
  return (
    <Tabs defaultValue="contact">
      <TabsList aria-label="Inbox">
        {INBOX.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
            <span className="bg-secondary text-lv-text-2 rounded-full px-2 py-0.5 text-xs tabular-nums">
              {tab.count}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {INBOX.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="text-sm">
          {tab.panel}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function SegmentedDemo() {
  const [size, setSize] = useState('phone');
  return (
    <div className="flex flex-col gap-2">
      <ToggleGroup
        type="single"
        aria-label="Preview size"
        value={size}
        onValueChange={(next) => next && setSize(next)}
      >
        <ToggleGroupItem value="phone">Phone</ToggleGroupItem>
        <ToggleGroupItem value="tablet">Tablet</ToggleGroupItem>
        <ToggleGroupItem value="desktop">Desktop</ToggleGroupItem>
      </ToggleGroup>
      <p className="text-muted-foreground m-0 text-[13px]">Showing: {size}</p>
    </div>
  );
}
