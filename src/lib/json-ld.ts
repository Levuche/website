/**
 * JSON for a `<script type="application/ld+json">` element. Characters that
 * matter to the HTML parser are written as JSON escapes, so no text can end
 * the script element. The output is still valid JSON with the same value.
 */
const ESCAPES: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

export function serializeJsonLd(data: unknown): string {
  const json = JSON.stringify(data) ?? 'null';
  return json.replace(/[<>&\u2028\u2029]/g, (c) => ESCAPES[c]);
}
