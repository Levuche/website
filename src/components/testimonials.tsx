import type { Testimonial } from '@buildbase/sdk/server';

/** Testimonials from Buildbase, as quote cards. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5 p-0">
      {items.map((t, i) => {
        const role = [t.position, t.company?.name].filter(Boolean).join(', ');
        return (
          <li
            key={`${i}-${t.name}`}
            className="bg-lv-card border-lv-border m-0 flex flex-col gap-4 rounded-[20px] border p-7"
          >
            <blockquote className="text-lv-text-2 m-0 text-base leading-relaxed">
              “{t.content}”
            </blockquote>
            <p className="m-0 mt-auto flex items-center gap-3">
              {t.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.avatar}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  className="size-10 rounded-full object-cover"
                />
              ) : null}
              <span className="flex flex-col">
                <span className="text-lv-text font-bold">{t.name}</span>
                {role ? (
                  <span className="text-lv-text-3 text-sm">{role}</span>
                ) : null}
              </span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
