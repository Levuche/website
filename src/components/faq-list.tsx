import type { Faq } from '@buildbase/sdk/server';
import { ArticleHtml } from '@/components/article-html';
import { renderMarkdown } from '@/lib/markdown';

/** Questions from a Buildbase FAQ collection; answers are Markdown. */
export function FaqList({
  faqs,
  openFirst = false,
}: {
  faqs: Faq[];
  openFirst?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {faqs.map((item, i) => (
        <details
          key={`${i}-${item.question}`}
          open={openFirst && i === 0}
          className="bg-lv-surface rounded-2xl px-4 py-3.5"
        >
          <summary className="min-h-6 cursor-pointer text-[15px] font-semibold">
            {item.question}
          </summary>
          <ArticleHtml
            html={renderMarkdown(item.answer).html}
            className="mt-2.5 text-sm [&_p]:my-2"
          />
        </details>
      ))}
    </div>
  );
}
