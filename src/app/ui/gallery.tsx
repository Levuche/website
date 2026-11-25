'use client';

import {
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  LinkIcon,
  LockIcon,
  MailIcon,
  PlusIcon,
  QrCodeIcon,
  SearchIcon,
  Share2Icon,
  Undo2Icon,
} from 'lucide-react';
import { useId } from 'react';
import { LevucheIcon } from '@/components/logo';
import { FeatureList, QuoteCard, StepList } from '@/components/marketing';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertAction, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, initials } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
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
        <h1 className="m-0 text-[clamp(26px,3vw,36px)] font-bold tracking-[-0.6px]">
          Levuche app components
        </h1>
        <p className="text-lv-text-2 m-0 max-w-[60ch]">
          The website’s and app’s own components: shadcn/ui components in
          src/components/ui, in Levuche’s colours from the Atoms, Molecules and
          Organisms boards. Light on the left, dark on the right (stacked on
          small screens). The blocks for creators’ pages are in @levuche/ui.
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
  const id = useId();
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
        <p className="m-0 text-[48px] leading-[1.08] font-bold tracking-[-1.2px]">
          Display
        </p>
        <p className="m-0 text-[36px] leading-[1.15] font-bold tracking-[-0.6px]">
          Heading 1
        </p>
        <p className="text-lv-text-2 m-0 max-w-[60ch] text-base leading-[1.6]">
          Body text at 16 px with 1.6 line height, held to about 65 characters
          per line.
        </p>
      </Group>

      <Group id={g('icons')} title="Icons">
        <div className="flex flex-wrap gap-3.5">
          <LevucheIcon size={24} />
          {[
            ['Back', ArrowLeftIcon],
            ['Add', PlusIcon],
            ['Undo', Undo2Icon],
            ['Share', Share2Icon],
            ['QR code', QrCodeIcon],
            ['Email', MailIcon],
            ['Lock', LockIcon],
            ['Check', CheckIcon],
            ['Link', LinkIcon],
            ['Preview', EyeIcon],
            ['Search', SearchIcon],
          ].map(([name, Icon]) => {
            const Glyph = Icon as typeof CheckIcon;
            return (
              <Glyph
                key={name as string}
                role="img"
                aria-label={name as string}
              />
            );
          })}
        </div>
      </Group>

      <Group id={g('buttons')} title="Buttons">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button>Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Secondary</Button>
          <Button variant="destructive">Remove</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" size="icon" aria-label="Undo">
            <Undo2Icon aria-hidden />
          </Button>
          <Button asChild variant="outline">
            <a href="#top">Link as button</a>
          </Button>
        </div>
        <ButtonDemo />
      </Group>

      <Group id={g('forms')} title="Form fields">
        <HandleFieldDemo />
        <Field>
          <FieldLabel htmlFor={`${id}-bio`}>Short bio</FieldLabel>
          <Textarea id={`${id}-bio`} defaultValue="How everyday things began" />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-animation`}>Animation</FieldLabel>
          <NativeSelect id={`${id}-animation`} defaultValue="fade">
            <NativeSelectOption value="fade">
              Fade up on scroll
            </NativeSelectOption>
            <NativeSelectOption value="none">None</NativeSelectOption>
          </NativeSelect>
        </Field>
        <div className="flex flex-wrap gap-5">
          <Field orientation="horizontal">
            <Checkbox id={`${id}-prices`} defaultChecked />
            <FieldLabel htmlFor={`${id}-prices`}>Show prices</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id={`${id}-reels`} />
            <FieldLabel htmlFor={`${id}-reels`}>Show reels</FieldLabel>
          </Field>
        </div>
        <EmailSignupDemo />
      </Group>

      <Group id={g('badges')} title="Badges, avatars, loading">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">Live</Badge>
          <Badge variant="warning">Draft</Badge>
          <Badge>Handled</Badge>
          <Badge variant="destructive">Failed</Badge>
          <Avatar className="size-8" aria-hidden>
            <AvatarFallback className="bg-lv-accent text-lv-on-accent text-xs">
              {initials('Desi Origins')}
            </AvatarFallback>
          </Avatar>
          <Avatar aria-hidden>
            <AvatarFallback>{initials('Jaya Lal')}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-2" aria-hidden>
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
      </Group>

      <Group id={g('navigation')} title="Tabs and segmented control">
        <SegmentedDemo />
        <TabsDemo />
      </Group>

      <Group id={g('lists')} title="List rows">
        <div>
          <Item>
            <ItemMedia>
              <span className="bg-secondary block size-12 rounded-[10px]" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Origins reel pack</ItemTitle>
              <ItemDescription>3 files · release 1.2</ItemDescription>
            </ItemContent>
            <ItemActions className="font-bold tabular-nums">$12.00</ItemActions>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Priya S.</ItemTitle>
              <ItemDescription>
                Is the scripting guide in Hindi too?
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="warning">New</Badge>
            </ItemActions>
          </Item>
        </div>
      </Group>

      <Group id={g('alerts')} title="Alerts and empty state">
        <Alert variant="success">
          <CheckIcon aria-hidden />
          <AlertDescription>Version 13 is live.</AlertDescription>
        </Alert>
        <Alert>
          <AlertDescription>
            Your draft has 3 unpublished changes.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertDescription>
            Couldn’t publish: the refund policy is empty.
          </AlertDescription>
          <AlertAction>
            <a href="#top" className="text-destructive">
              Open policy
            </a>
          </AlertAction>
        </Alert>
        <Empty>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>
            Add a contact form to your site to start receiving them.
          </EmptyDescription>
          <EmptyContent>
            <Button asChild className="text-sm">
              <a href="#top">Add contact page</a>
            </Button>
          </EmptyContent>
        </Empty>
      </Group>

      <Group id={g('faq')} title="Accordion">
        <Accordion type="multiple" defaultValue={['monthly']}>
          <AccordionItem value="monthly">
            <AccordionTrigger>Do I pay every month?</AccordionTrigger>
            <AccordionContent>No. $9 once per page.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="domain">
            <AccordionTrigger>Can I use my own domain?</AccordionTrigger>
            <AccordionContent>Yes, as an add-on.</AccordionContent>
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
