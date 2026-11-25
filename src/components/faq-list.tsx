import type { Faq } from '@buildbase/sdk/server';
import { Accordion, AccordionItem } from '@/components/ui/disclosure';
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
    <Accordion>
      {faqs.map((item, i) => (
        <AccordionItem
          key={`${i}-${item.question}`}
          title={item.question}
          defaultOpen={openFirst && i === 0}
        >
          <ArticleHtml
            html={renderMarkdown(item.answer).html}
            className="text-sm [&_p]:my-2"
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
