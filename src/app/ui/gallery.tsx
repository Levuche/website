'use client';

import { LevucheIcon } from '@/components/logo';
import {
  AddIcon,
  BackIcon,
  CheckIcon,
  EmailIcon,
  LinkIcon,
  LockIcon,
  PreviewIcon,
  QrCodeIcon,
  SearchIcon,
  ShareIcon,
  UndoIcon,
} from '@/components/ui/icons';
import { Avatar, Skeleton } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, IconButton, buttonClasses } from '@/components/ui/button';
import { Accordion, AccordionItem, ListRow } from '@/components/ui/disclosure';
import { Alert, EmptyState } from '@/components/ui/feedback';
import { Choice, SelectField, TextAreaField } from '@/components/ui/field';
import {
  Card,
  FeatureList,
  QuoteCard,
  StepList,
} from '@/components/ui/marketing';
import {
  ButtonDemo,
  EmailSignupDemo,
  HandleFieldDemo,
  SegmentedDemo,
  TabsDemo,
} from './demos';

/**
 * The component gallery at /ui: every component in light and dark, side by
 * side. The end-to-end tests (e2e/components.spec.ts) run against it.
 */
export function Gallery() {
  return (
    <main
      id="main-content"
      className="bg-lv-canvas text-lv-text flex min-h-screen flex-col gap-6 p-[clamp(12px,3vw,40px)] font-sans"
    >
      <header id="top" className="flex flex-col gap-2">
        <h1 className="m-0 text-[clamp(30px,4vw,44px)] font-bold tracking-[-1px]">
          Levuche app components
        </h1>
        <p className="text-lv-text-2 m-0 max-w-[60ch]">
          The website’s and app’s own components (src/components/ui), built from
          the Atoms, Molecules and Organisms boards. Light on the left, dark on
          the right (stacked on small screens). The blocks for creators’ pages
          are in @levuche/ui.
        </p>
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,560px),1fr))] gap-6">
        <Panel mode="light" />
        <Panel mode="dark" />
      </div>
    </main>
  );
}

function Group({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      data-testid={id.replace(/^(light|dark)-/, '')}
      className="flex flex-col gap-3.5"
    >
      <h3 id={id} className="m-0 text-[17px] font-bold">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Panel({ mode }: { mode: 'light' | 'dark' }) {
  const g = (name: string) => `${mode}-${name}`;
  const label = mode === 'light' ? 'Light' : 'Dark';
  return (
    <section
      data-lv={mode}
      data-testid={`gallery-${mode}`}
      aria-labelledby={g('title')}
      className="bg-lv-bg text-lv-text border-lv-border flex min-w-0 flex-col gap-10 rounded-3xl border p-[clamp(16px,3vw,40px)]"
    >
      <h2 id={g('title')} className="m-0 text-[28px] tracking-[-0.5px]">
        {label}
      </h2>

      <Group id={g('type')} title="Type">
        <p className="m-0 text-[56px] leading-[1.05] font-bold tracking-[-1.5px]">
          Display
        </p>
        <p className="m-0 text-[36px] leading-[1.15] font-bold tracking-[-0.8px]">
          Heading 1
        </p>
        <p className="text-lv-text-2 m-0 max-w-[60ch] text-[17px] leading-[1.6]">
          Body text at 17 px with 1.6 line height, held to about 65 characters
          per line.
        </p>
      </Group>

      <Group id={g('icons')} title="Icons">
        <div className="flex flex-wrap gap-3.5">
          <LevucheIcon size={24} />
          <BackIcon title="Back" />
          <AddIcon title="Add" />
          <UndoIcon title="Undo" />
          <ShareIcon title="Share" />
          <QrCodeIcon title="QR code" />
          <EmailIcon title="Email" />
          <LockIcon title="Lock" />
          <CheckIcon title="Check" />
          <LinkIcon title="Link" />
          <PreviewIcon title="Preview" />
          <SearchIcon title="Search" />
        </div>
      </Group>

      <Group id={g('buttons')} title="Buttons">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button>Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Remove</Button>
          <Button disabled>Disabled</Button>
          <IconButton label="Undo">
            <UndoIcon size={18} />
          </IconButton>
          <a href="#top" className={buttonClasses({ variant: 'secondary' })}>
            Link as button
          </a>
        </div>
        <ButtonDemo />
      </Group>

      <Group id={g('forms')} title="Form fields">
        <HandleFieldDemo />
        <TextAreaField
          label="Short bio"
          defaultValue="How everyday things began"
        />
        <SelectField label="Animation" defaultValue="fade">
          <option value="fade">Fade up on scroll</option>
          <option value="none">None</option>
        </SelectField>
        <div className="flex flex-wrap gap-5">
          <Choice label="Show prices" defaultChecked />
          <Choice label="Show reels" />
        </div>
        <EmailSignupDemo />
      </Group>

      <Group id={g('badges')} title="Badges, avatars, loading">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="live">Live</Badge>
          <Badge tone="draft">Draft</Badge>
          <Badge>Handled</Badge>
          <Badge tone="failed">Failed</Badge>
          <Avatar name="Desi Origins" size={32} tone="accent" />
          <Avatar name="Jaya Lal" />
        </div>
        <Skeleton />
      </Group>

      <Group id={g('navigation')} title="Tabs and segmented control">
        <SegmentedDemo />
        <TabsDemo />
      </Group>

      <Group id={g('lists')} title="List rows">
        <div>
          <ListRow
            thumbnail={
              <span className="bg-lv-surface-2 size-12 flex-none rounded-[10px]" />
            }
            title="Origins reel pack"
            detail="3 files · release 1.2"
            end={<span className="font-bold tabular-nums">$12.00</span>}
          />
          <ListRow
            title="Priya S."
            detail="Is the scripting guide in Hindi too?"
            end={<Badge tone="draft">New</Badge>}
          />
        </div>
      </Group>

      <Group id={g('alerts')} title="Alerts and empty state">
        <Alert tone="success">Version 13 is live.</Alert>
        <Alert>Your draft has 3 unpublished changes.</Alert>
        <Alert
          tone="danger"
          action={
            <a href="#top" className="text-lv-danger">
              Open policy
            </a>
          }
        >
          Couldn’t publish: the refund policy is empty.
        </Alert>
        <EmptyState
          title="No messages yet"
          action={
            <a href="#top" className={buttonClasses({ className: 'text-sm' })}>
              Add contact page
            </a>
          }
        >
          Add a contact form to your site to start receiving them.
        </EmptyState>
      </Group>

      <Group id={g('faq')} title="Accordion">
        <Accordion>
          <AccordionItem title="Do I pay every month?" defaultOpen>
            <p className="text-lv-text-2 m-0 text-sm">No. $9 once per page.</p>
          </AccordionItem>
          <AccordionItem title="Can I use my own domain?">
            <p className="text-lv-text-2 m-0 text-sm">Yes, as an add-on.</p>
          </AccordionItem>
        </Accordion>
      </Group>

      <Group id={g('marketing')} title="Marketing sections">
        <StepList
          steps={[
            { title: 'Connect', body: 'Link your Instagram.' },
            { title: 'Add a pack', body: 'Upload what you sell.' },
            { title: 'Share', body: 'Put the link in your bio.' },
          ]}
        />
        <FeatureList
          features={[
            { title: 'Pay once', body: 'No monthly fee.' },
            { title: 'Your brand', body: 'Your colours and fonts.' },
          ]}
        />
        <Card>
          <QuoteCard
            quote="My bio link finally sells."
            name="Desi Origins"
            role="Creator"
          />
        </Card>
      </Group>
    </section>
  );
}
