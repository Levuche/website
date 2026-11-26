import {
  allFolders,
  type ContentKind,
  type EntryLink,
  type FolderNode,
  getContentTree,
  getEntryTexts,
  getTags,
  type TagLink,
  tagsOf,
} from '@/lib/content';

/**
 * Search for the blog and the docs, on the site's own server: Buildbase
 * Content has no search of its own. It reads the same lists the pages use
 * (cached by the SDK client) and matches every word of the query against a
 * post's title, description, tags, folders and text. Posts whose title or
 * tags match come first. Folders and tags whose names match are listed too.
 */

/** Longest query looked at; anything after is ignored. */
export const MAX_QUERY = 100;

export interface SearchHit extends EntryLink {
  /** A few words around the first match in the text, or the description. */
  snippet: string;
}

export interface SearchResult {
  query: string;
  /** The tag the results are limited to, when one was picked. */
  tag: TagLink | null;
  /** The folder the search is limited to, when it was started in one. */
  folder: FolderNode | null;
  entries: SearchHit[];
  folders: FolderNode[];
  tags: TagLink[];
}

/** The words of a query, lower-cased, without duplicates. */
export function queryWords(query: string): string[] {
  return [
    ...new Set(
      query
        .slice(0, MAX_QUERY)
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.trim())
        .filter(Boolean)
    ),
  ];
}

function snippetFor(text: string, words: string[], fallback: string): string {
  const lower = text.toLowerCase();
  const at = words
    .map((word) => lower.indexOf(word))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  if (at === undefined) return fallback;
  const start = Math.max(0, at - 60);
  const end = Math.min(text.length, at + 120);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${
    end < text.length ? '…' : ''
  }`;
}

/** The names of the folders a post is filed under, outermost first. */
function folderNames(path: string, byPath: Map<string, FolderNode>): string[] {
  const parts = path.split('/').slice(0, -1);
  return parts
    .map((_, i) => byPath.get(parts.slice(0, i + 1).join('/'))?.name ?? '')
    .filter(Boolean);
}

export async function searchContent(
  kind: ContentKind,
  options: { query?: string; tag?: string; folder?: string }
): Promise<SearchResult> {
  const query = (options.query ?? '').slice(0, MAX_QUERY).trim();
  const words = queryWords(query);
  const [tree, tags, texts] = await Promise.all([
    getContentTree(kind),
    getTags(kind),
    getEntryTexts(kind),
  ]);
  const folders = allFolders(tree);
  const byPath = new Map(folders.map((folder) => [folder.path, folder]));
  const tag = options.tag
    ? (tags.find((t) => t.slug === options.tag) ?? null)
    : null;
  const folder = options.folder ? (byPath.get(options.folder) ?? null) : null;

  const usedTagIds = new Set(tree.all.flatMap((entry) => entry.tagIds));
  const result: SearchResult = {
    query,
    tag,
    folder,
    entries: [],
    folders: [],
    tags: [],
  };
  // A tag that doesn't exist, or a folder that doesn't: nothing to list.
  if ((options.tag && !tag) || (options.folder && !folder)) return result;
  if (words.length === 0 && !tag) return result;

  const scored = tree.all
    .filter((entry) => !folder || entry.path.startsWith(`${folder.path}/`))
    .filter((entry) => !tag || entry.tagIds.includes(tag.id))
    .map((entry) => {
      const text = texts.get(entry.id) ?? '';
      const tagNames = tagsOf(entry.tagIds, tags).map((t) => t.title);
      const fields = {
        title: entry.title.toLowerCase(),
        tags: tagNames.join(' ').toLowerCase(),
        folders: folderNames(entry.path, byPath).join(' ').toLowerCase(),
        description: entry.description.toLowerCase(),
        text: text.toLowerCase(),
      };
      let score = 0;
      for (const word of words) {
        let hit = 0;
        if (fields.title.includes(word)) hit += 5;
        if (fields.tags.includes(word)) hit += 3;
        if (fields.folders.includes(word)) hit += 2;
        if (fields.description.includes(word)) hit += 2;
        if (fields.text.includes(word)) hit += 1;
        // Every word has to be found somewhere.
        if (hit === 0) return null;
        score += hit;
      }
      const hit: SearchHit = {
        ...entry,
        snippet: words.length
          ? snippetFor(text, words, entry.description)
          : entry.description,
      };
      return { hit, score };
    })
    .filter((item): item is { hit: SearchHit; score: number } => item !== null);
  // Best match first; ties keep the list's own order (newest first, or by
  // title for the docs), since sort is stable.
  result.entries = scored
    .sort((a, b) => b.score - a.score)
    .map((item) => item.hit);

  if (words.length > 0 && !tag) {
    const matches = (name: string) =>
      words.every((word) => name.toLowerCase().includes(word));
    result.folders = folders
      .filter((f) => !folder || f.path.startsWith(`${folder.path}/`))
      .filter((f) => matches(f.name));
    result.tags = tags.filter((t) => usedTagIds.has(t.id) && matches(t.title));
  }
  return result;
}
