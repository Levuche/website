/** An error from one of the site's own API routes, with its error code. */
export class ApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number
  ) {
    super(code);
    this.name = 'ApiError';
  }
}

/**
 * POSTs JSON to one of the site's own API routes (/api/...) and returns the
 * JSON answer. A failed answer throws an ApiError with the route's `error`
 * code, or "unavailable" when it gave none.
 */
export async function postJson<T = unknown>(
  path: `/api/${string}`,
  body: unknown
): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new ApiError(data.error ?? 'unavailable', res.status);
  return data;
}
