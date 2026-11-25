/**
 * A long-form body from Buildbase (legal page, blog post, doc): HTML from
 * `renderMarkdown` (src/lib/markdown.ts), already sanitised on the server,
 * with the site's prose typography (`.lv-prose` in globals.css). Never pass
 * it anything else.
 */
export function ArticleHtml({
  html,
  className = '',
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`lv-prose ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
