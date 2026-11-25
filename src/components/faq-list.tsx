import type { Faq } from '@buildbase/sdk/server';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
    <Accordion type="multiple" defaultValue={openFirst ? ['faq-0'] : []}>
      {faqs.map((item, i) => (
        <AccordionItem key={`${i}-${item.question}`} value={`faq-${i}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            <ArticleHtml
              html={renderMarkdown(item.answer).html}
              className="text-sm [&_p]:my-2"
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
