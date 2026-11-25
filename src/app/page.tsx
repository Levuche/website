import type { Metadata } from 'next';
import Link from 'next/link';
import { BetaForm } from '@/components/beta-form';
import { JsonLd } from '@/components/json-ld';
import { SiteShell } from '@/components/site-shell';
import { betaFormAction } from '@/lib/contact';
import { pageMetadata } from '@/lib/metadata';
import { absoluteUrl, site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'Levuche: Your link in bio, now a shop',
  absoluteTitle: true,
  description:
    'Levuche turns your Instagram link into a small website that sells your packs, prompts and guides. Pay $9 once. No monthly fee.',
});

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/levuche-icon-512.png'),
  parentOrganization: {
    '@type': 'Organization',
    name: site.owner.name,
    url: site.owner.url,
    founder: { '@type': 'Person', name: site.owner.founder },
  },
};

const steps = [
  {
    title: 'Claim your name',
    body: 'Pick a handle and get yourname.levuche.page. One name, one site, yours alone.',
  },
  {
    title: 'Drag in sections',
    body: 'Build your home page from ready-made sections in your own brand. It looks right on every phone.',
  },
  {
    title: 'Sell and get paid',
    body: 'Add your packs. Buyers pay by card and download straight away. You see every sale.',
  },
];

const features = [
  {
    title: 'Your brand, not ours',
    body: 'Set your colours, fonts and logo once; every section follows them in light and dark.',
  },
  {
    title: 'Legal pages written for you',
    body: 'Privacy, terms, refund and shipping pages from templates you review.',
  },
  {
    title: 'Instant downloads',
    body: 'Sell prompts, guides and templates. Buyers get secure links the moment they pay.',
  },
  {
    title: 'Forms and newsletter',
    body: 'Contact, newsletter and waitlist forms land in one inbox.',
  },
  {
    title: 'Tracked short links',
    body: 'A short link and QR code for every reel, with clicks by source.',
  },
  {
    title: 'Versions you can undo',
    body: 'Preview a draft, publish when ready, roll back in one click.',
  },
];

const container = 'mx-auto max-w-[1240px] px-[clamp(16px,3vw,32px)]';
const sectionY = 'py-[clamp(56px,7vw,96px)]';
const h2 = 'm-0 text-[clamp(30px,4vw,44px)] font-bold tracking-[-1px]';

export default function HomePage() {
  return (
    <SiteShell>
      <JsonLd data={organization} />

      <section
        id="beta"
        className={`${container} grid scroll-mt-4 grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-[clamp(32px,5vw,64px)] pt-[clamp(24px,4vw,56px)] pb-[clamp(56px,7vw,96px)]`}
      >
        <div className="flex flex-col gap-6">
          <h1 className="m-0 text-[clamp(40px,6vw,64px)] leading-[1.05] font-bold tracking-[-2px]">
            Your link in bio, now a shop.
          </h1>
          <p className="text-lv-text-2 m-0 max-w-[520px] text-[clamp(17px,2vw,20px)] leading-relaxed">
            Levuche turns your Instagram link into a small website that sells
            your packs, prompts and guides. Pay $9 once. No monthly fee.
          </p>
          <BetaForm action={betaFormAction} />
          <p className="text-lv-text-3 m-0 text-sm">
            We approve creators in small groups. You will get an email when your
            spot opens.
          </p>
        </div>
        <div className="flex justify-center">
          <PhonePreview />
        </div>
      </section>

      <section id="how" className={`bg-lv-surface ${sectionY} scroll-mt-4`}>
        <div className={`${container} flex flex-col gap-10`}>
          <h2 className={h2}>Live in three steps</h2>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5 p-0">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="bg-lv-card border-lv-border flex flex-col gap-3 rounded-[20px] border p-7"
              >
                <span
                  aria-hidden
                  className="bg-lv-brand text-lv-on-brand flex size-11 items-center justify-center rounded-full font-bold"
                >
                  {i + 1}
                </span>
                <h3 className="m-0 text-[22px] font-bold">{step.title}</h3>
                <p className="text-lv-text-2 m-0 text-base leading-relaxed">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="features"
        className={`${container} ${sectionY} flex scroll-mt-4 flex-col gap-10`}
      >
        <h2 className={h2}>Everything a creator store needs</h2>
        <dl className="border-lv-border m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-12 border-t">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border-lv-border border-b py-[22px]"
            >
              <dt className="text-[19px] font-bold">{feature.title}</dt>
              <dd className="text-lv-text-2 mx-0 mt-1.5 leading-relaxed">
                {feature.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="pricing" className={`bg-lv-surface ${sectionY} scroll-mt-4`}>
        <div
          className={`${container} grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-10`}
        >
          <div className="flex flex-col gap-4">
            <h2 className={h2}>Pay once. Then only for what you use.</h2>
            <p className="text-lv-text-2 m-0 text-lg leading-relaxed">
              No monthly fee just to keep your page online.
            </p>
          </div>
          <div className="bg-lv-card border-lv-border flex flex-col gap-[18px] rounded-[28px] border p-[clamp(24px,3vw,36px)]">
            <p className="m-0 flex items-baseline gap-2.5">
              <span className="text-lv-text text-[56px] font-bold">$9</span>
              <span className="text-lv-text-2">once</span>
            </p>
            <ul className="text-lv-text-2 m-0 flex flex-col gap-2.5 pl-5 leading-normal">
              <li>Your site at yourname.levuche.page</li>
              <li>[YOUR FEE]% per sale, only when you sell</li>
              <li>Storage and extras from prepaid credits</li>
              <li>Your own domain, when you want it</li>
            </ul>
            <Link
              href="/#beta"
              className="bg-lv-primary text-lv-on-primary rounded-full p-4 text-center font-bold no-underline"
            >
              Join the beta
            </Link>
          </div>
        </div>
      </section>

      <section className={`bg-lv-brand ${sectionY}`}>
        <div
          className={`${container} flex flex-wrap items-center justify-between gap-7`}
        >
          <h2 className="text-lv-on-brand m-0 text-[clamp(34px,5vw,52px)] font-bold tracking-[-1.5px]">
            Say “I’ll take it.”
          </h2>
          <Link
            href="/#beta"
            className="bg-lv-accent text-lv-on-accent rounded-full px-8 py-[18px] text-lg font-bold no-underline"
          >
            Get early access
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

/** The sample creator site ("Desi Origins") in a phone frame. */
function PhonePreview() {
  return (
    <figure
      data-site="dark"
      aria-label="Example creator site on Levuche"
      className="border-lv-text bg-site-bg shadow-lv m-0 box-border flex w-[min(100%,320px)] flex-col gap-3.5 rounded-[40px] border-[10px] px-5 py-[26px]"
    >
      <div className="flex flex-col items-center gap-2 pt-1.5">
        <div
          aria-hidden
          className="bg-site-accent text-site-on-accent flex size-[76px] items-center justify-center rounded-full text-[28px] font-bold"
        >
          DO
        </div>
        <p className="text-site-text m-0 text-lg font-bold">Desi Origins</p>
        <p className="text-site-text-2 m-0 text-center text-[13px]">
          How everyday things began
        </p>
      </div>
      <div className="bg-site-surface flex items-center gap-3 rounded-[18px] p-3.5">
        <div className="bg-site-surface-2 size-14 flex-none rounded-xl" />
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-site-text m-0 text-sm font-bold">
            Origins reel pack
          </p>
          <p className="text-site-text-2 m-0 text-xs">100 prompts, 1 guide</p>
        </div>
        <p className="text-site-text m-0 text-[15px] font-bold">$[PRICE]</p>
      </div>
      <p className="bg-site-accent text-site-on-accent m-0 rounded-full p-3.5 text-center text-[15px] font-bold">
        I’ll take it
      </p>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((n) => (
          <div
            key={n}
            className="bg-site-surface-2 aspect-[9/14] rounded-[10px]"
          />
        ))}
      </div>
      <figcaption className="text-site-text-2 text-center text-xs">
        desiorigins.levuche.page
      </figcaption>
    </figure>
  );
}
