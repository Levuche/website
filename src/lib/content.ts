import {
  createServerClient,
  type BlogPost,
  type ContentFolder,
  type ContentFolderTreeNode,
  type DocPage,
  type Faq,
  type RichContent,
  type Testimonial,
} from '@buildbase/sdk/server';
import { buildbase } from '@/lib/buildbase-config';
import { seedCollection, seedFaqs, seedRichContent } from '@/lib/seed';

/**
 * Every piece of editable copy on levuche.com comes from Buildbase:
 *
 * - Blog posts and docs pages: Content, Blogs and Docs. The site follows
 *   their folder tree, so /blog/<folder>/<post> and /docs/<folder>/<page>
 *   match the folders, names and slugs set in the console.
 * - FAQs: Content, FAQs, one collection per page.
 * - Testimonials: Content, Testimonials.
 * - Legal and trust pages: Content, Docs, one page each in the `legal`
 *   folder (`legal/<page slug>`). They are kept out of /docs and its
 *   sitemap entries, so each page has one address: /<page slug>.
 * - Lists the CMS has no type for (home steps and features): Content,
 *   Collections.
 *
 * Prices are not content: they come from Buildbase Billing
 * (src/lib/billing.ts).
 *
 * The slugs below are the contract with the console; docs/BUILDBASE.md
 * lists every one with its fields. Reads use the org API token on the
 * server only (BUILDBASE_API_TOKEN, content-reader role). When an entry is
 * missing, a reader returns null or an empty list and the page leaves that
 * part out instead of failing. With no token at all (a local run or a
 * preview before Buildbase is set up) the home and pricing readers return
 * the seed text in content/buildbase/ (src/lib/seed.ts), so the pages match
 * the design boards; legal pages, the blog and docs stay empty.
 *
 * Content blocks (rich content) are for copy the other types don't cover
 * and that changes often or is shaped per page, such as a changelog entry;
 * read one with getRichContent.
 */
export const CONTENT = {
  faqs: { home: 'home-faq', pricing: 'pricing-faq' },
  collections: {
    homeSteps: 'home-steps',
    homeFeatures: 'home-features',
  },
  /** Docs folder holding the legal and trust pages, one doc per page. */
  legalFolder: 'legal',
} as const;

const apiToken = process.env.BUILDBASE_API_TOKEN?.trim() ?? '';

// Built once per server instance, so its in-memory cache is shared by every
// request that instance serves. The content webhook (/api/webhooks/content)
// drops entries when something is edited in the console.
const client = apiToken.includes(':')
  ? createServerClient({
      serverUrl: buildbase.serverUrl,
      apiToken,
      source: 'levuche-website',
    })
  : null;

export const contentClient = client;

async function read<T>(
  what: string,
  fn: (c: NonNullable<typeof client>) => Promise<T>
) {
  if (!client) return null;
  try {
    return await fn(client);
  } catch (error) {
    console.warn(
      `Buildbase content: ${what} unavailable:`,
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

export async function getRichContent(
  slug: string
): Promise<RichContent | null> {
  if (!client) return seedRichContent(slug);
  const entry = await read(`rich content ${slug}`, (c) =>
    c.richContent.get(slug)
  );
  return entry && !entry.archived ? entry : null;
}

export async function getFaqs(collection: string): Promise<Faq[]> {
  if (!client) return seedFaqs(collection);
  const faqs = await read(`faqs ${collection}`, (c) =>
    c.faqs.questions(collection)
  );
  return (faqs ?? []).filter((f) => !f.archived);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const page = await read('testimonials', (c) =>
    c.testimonials.list({ limit: 50 })
  );
  return (page?.docs ?? []).filter((t) => t.published !== false && !t.archived);
}

/** A collection's live records, archived ones dropped, sorted by `order`. */
export async function getCollection<T extends Record<string, unknown>>(
  slug: string
): Promise<T[]> {
  if (!client) return seedCollection(slug) as T[];
  const records = await read(`collection ${slug}`, (c) =>
    c.collections.data<T>(slug)
  );
  return (records ?? [])
    .filter((r) => !r.archived)
    .map((r) => r.data)
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
}

/*
 * Blog and docs: the site follows the folder tree in Buildbase. A folder's
 * address is its parents' slugs and its own (`guides/setup`); a post's is its
 * folder's address and its slug (`guides/setup/connect-instagram`). Folders
 * and posts added or moved in the console show up on the next request, with
 * no change here: /blog/<path> and /docs/<path> render whichever post or
 * folder the path names.
 */

export type ContentKind = 'blogs' | 'docs';
type Entry = BlogPost | DocPage;

/** A post as the index pages and navigation show it. */
export interface EntryLink {
  id: string;
  title: string;
  description: string;
  publishedAt: string | null;
  updatedAt: string | null;
  /** Path under /blog or /docs: folder path, then slug. */
  path: string;
}

export interface FolderNode {
  id: string;
  name: string;
  slug: string;
  /** Path under /blog or /docs: the parents' slugs, then this folder's. */
  path: string;
  /** Sub-folders that hold at least one published post. */
  folders: FolderNode[];
  /** Published posts filed directly in this folder. */
  entries: EntryLink[];
}

export interface ContentTree {
  /** Top-level folders that hold at least one published post. */
  folders: FolderNode[];
  /** Published posts that are not in a folder. */
  entries: EntryLink[];
  /** Every published post, in list order, with its path. */
  all: EntryLink[];
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

function folderOf(item: Entry): ContentFolder | null {
  return item.folder && typeof item.folder === 'object' ? item.folder : null;
}

function folderId(item: Entry): string | null {
  if (!item.folder) return null;
  return typeof item.folder === 'string' ? item.folder : item.folder._id;
}

/** A doc filed in the legal folder, shown at /<slug> rather than under /docs. */
function isLegalDoc(item: DocPage): boolean {
  return folderOf(item)?.slug === CONTENT.legalFolder;
}

function isLive(item: Entry): boolean {
  return item.published === true && item.archived !== true;
}

async function listEntries(kind: ContentKind): Promise<Entry[]> {
  const page = await read(kind, (c) =>
    kind === 'blogs'
      ? c.blogs.list({ limit: 100, sort: { publishedAt: -1 } })
      : c.docs.list({ limit: 100, sort: { title: 1 } })
  );
  return (page?.docs ?? []) as Entry[];
}

async function folderTree(kind: ContentKind): Promise<ContentFolderTreeNode[]> {
  const nodes = await read(`${kind} folders`, (c) => c[kind].tree());
  return Array.isArray(nodes) ? nodes : [];
}

function childNodes(node: ContentFolderTreeNode): ContentFolderTreeNode[] {
  const kids = [...(node.children ?? []), ...(node.subFolders ?? [])];
  return kids.filter(
    (kid): kid is ContentFolderTreeNode =>
      typeof kid === 'object' && kid !== null
  );
}

/**
 * A folder's path when the tree didn't list it: its URL on the site Buildbase
 * builds (`/docs/guides/setup`), or its parent path and its own slug.
 */
function fallbackFolderPath(folder: ContentFolder, kind: ContentKind): string {
  const url = trimSlashes(folder.url ?? '');
  const prefix = kind === 'blogs' ? /^(blogs?)\// : /^docs\//;
  if (url && prefix.test(url)) return url.replace(prefix, '');
  return [trimSlashes(folder.path ?? ''), folder.slug]
    .filter(Boolean)
    .join('/');
}

/**
 * The blog's or the docs' folders and published posts, as Buildbase files
 * them. Folders keep the tree's order; empty ones are left out. The legal
 * folder is left out of the docs, since those pages live at /<slug>.
 */
export async function getContentTree(kind: ContentKind): Promise<ContentTree> {
  const [nodes, items] = await Promise.all([
    folderTree(kind),
    listEntries(kind),
  ]);

  const byId = new Map<string, FolderNode>();
  const hidden = new Set<string>();
  const build = (
    node: ContentFolderTreeNode,
    parent: string,
    hide: boolean
  ): FolderNode | null => {
    const slug = (node.slug ?? '').trim();
    const id = node._id ?? '';
    if (!slug || !id || node.archived === true) return null;
    const path = [parent, slug].filter(Boolean).join('/');
    const skip =
      hide || (kind === 'docs' && !parent && slug === CONTENT.legalFolder);
    const folder: FolderNode = {
      id,
      name: (node.name ?? '').trim() || slug,
      slug,
      path,
      folders: [],
      entries: [],
    };
    if (skip) hidden.add(id);
    byId.set(id, folder);
    folder.folders = childNodes(node)
      .map((kid) => build(kid, path, skip))
      .filter((kid): kid is FolderNode => kid !== null);
    return folder;
  };
  const roots = nodes
    .map((node) => build(node, '', false))
    .filter((node): node is FolderNode => node !== null);

  const tree: ContentTree = { folders: [], entries: [], all: [] };
  for (const item of items) {
    if (!isLive(item)) continue;
    if (kind === 'docs' && isLegalDoc(item as DocPage)) continue;
    const id = folderId(item);
    if (id && hidden.has(id)) continue;
    let folder = id ? byId.get(id) : undefined;
    const info = folderOf(item);
    if (id && !folder && info) {
      // In a folder the tree didn't return: list it at the top level.
      folder = {
        id,
        name: info.name?.trim() || info.slug,
        slug: info.slug,
        path: fallbackFolderPath(info, kind),
        folders: [],
        entries: [],
      };
      byId.set(id, folder);
      roots.push(folder);
    }
    const link: EntryLink = {
      id: item._id,
      title: item.title,
      description: item.description ?? '',
      publishedAt: item.publishedAt ?? null,
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : null,
      path: [folder?.path, item.slug].filter(Boolean).join('/'),
    };
    (folder ? folder.entries : tree.entries).push(link);
    tree.all.push(link);
  }

  const prune = (list: FolderNode[]): FolderNode[] =>
    list
      .filter((folder) => !hidden.has(folder.id))
      .map((folder) => ({ ...folder, folders: prune(folder.folders) }))
      .filter(
        (folder) => folder.entries.length > 0 || folder.folders.length > 0
      );
  tree.folders = prune(roots);
  return tree;
}

/** The folder at a path, with the folders above it (outermost first). */
export function findFolder(
  tree: ContentTree,
  path: string
): { folder: FolderNode; parents: FolderNode[] } | null {
  const target = trimSlashes(path);
  const walk = (
    list: FolderNode[],
    parents: FolderNode[]
  ): { folder: FolderNode; parents: FolderNode[] } | null => {
    for (const folder of list) {
      if (folder.path === target) return { folder, parents };
      if (target.startsWith(`${folder.path}/`)) {
        const found = walk(folder.folders, [...parents, folder]);
        if (found) return found;
      }
    }
    return null;
  };
  return walk(tree.folders, []);
}

/** Every folder in the tree, outermost first, for the sitemap. */
export function allFolders(tree: ContentTree): FolderNode[] {
  const out: FolderNode[] = [];
  const walk = (list: FolderNode[]) => {
    for (const folder of list) {
      out.push(folder);
      walk(folder.folders);
    }
  };
  walk(tree.folders);
  return out;
}

/** Every published post in a folder and the folders under it. */
export function entriesUnder(folder: FolderNode): EntryLink[] {
  return [...folder.entries, ...folder.folders.flatMap(entriesUnder)];
}

/**
 * One published blog post or doc by its path on this site. Tries Buildbase's
 * own path lookup first, then the tree (for a post whose folder path the
 * lookup didn't match). Legal docs are never served under /docs.
 */
export async function getEntry(
  kind: ContentKind,
  path: string,
  tree?: ContentTree
): Promise<Entry | null> {
  const target = trimSlashes(path);
  if (!target) return null;
  const found = (await read(`${kind} ${target}`, (c) =>
    c[kind].byPath(target)
  )) as Entry | null;
  if (found && isLive(found)) {
    if (kind === 'docs' && isLegalDoc(found as DocPage)) return null;
    return found;
  }
  const link = (tree ?? (await getContentTree(kind))).all.find(
    (entry) => entry.path === target
  );
  if (!link) return null;
  const item = (await read(`${kind} ${link.id}`, (c) =>
    c[kind].get(link.id)
  )) as Entry | null;
  return item && isLive(item) ? item : null;
}

/**
 * A legal or trust page's published doc: `legal/<slug>` in Content, Docs.
 * Null until it is published, and the page then says its text is still
 * being written.
 */
export async function getLegalDoc(slug: string): Promise<DocPage | null> {
  const path = `${CONTENT.legalFolder}/${slug}`;
  const found = await read(`docs ${path}`, (c) => c.docs.byPath(path));
  if (found && isLive(found) && isLegalDoc(found)) return found;
  const all = (await listEntries('docs')) as DocPage[];
  return (
    all.find((doc) => doc.slug === slug && isLive(doc) && isLegalDoc(doc)) ??
    null
  );
}
