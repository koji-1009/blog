import sharp from 'sharp';

/** What a link card shows, read from the target page's Open Graph tags at build time. */
export interface LinkPreview {
  url: string;
  host: string;
  title: string;
  description?: string;
  image?: LinkPreviewImage;
}

/** The og:image, resized and embedded as a data URI so that the page makes no request for it. */
export interface LinkPreviewImage {
  src: string;
  width: number;
  height: number;
}

const TIMEOUT_MS = 10_000;
// Twice the width the card shows the image at.
const IMAGE_WIDTH = 384;

// Several cards on one page (or across pages) can point to the same URL; fetch each once per build.
const cache = new Map<string, Promise<LinkPreview | null>>();

/**
 * Fetches `url` and reads og:title, og:description and og:image. Returns null when the page
 * cannot be fetched or has no title, so that the caller can fall back to a plain link and the
 * build does not fail because another site is down.
 */
export function getLinkPreview(url: string): Promise<LinkPreview | null> {
  let preview = cache.get(url);
  if (!preview) {
    preview = fetchLinkPreview(url);
    cache.set(url, preview);
  }
  return preview;
}

async function fetchLinkPreview(url: string): Promise<LinkPreview | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const title = readMeta(html, 'og:title') ?? readTitle(html);
    if (!title) throw new Error('no og:title or <title>');
    const image = readMeta(html, 'og:image');
    const { title: cardTitle, description } = tidyGitHub(title, readMeta(html, 'og:description'));
    return {
      url,
      host: new URL(url).host,
      title: cardTitle,
      description,
      image: image ? await fetchImage(new URL(image, url).href) : undefined,
    };
  } catch (error) {
    console.warn(`[link-card] ${url}: ${message(error)}; rendering a plain link`);
    return null;
  }
}

/**
 * Downloads the image once and embeds it. The image is optional: when it cannot be fetched
 * (GitHub's image server answers 429 to bursts, for example), the card has text only.
 */
async function fetchImage(url: string): Promise<LinkPreviewImage | undefined> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { data, info } = await sharp(Buffer.from(await response.arrayBuffer()))
      .resize({ width: IMAGE_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
    return { src: `data:image/webp;base64,${data.toString('base64')}`, width: info.width, height: info.height };
  } catch (error) {
    console.warn(`[link-card] ${url}: ${message(error)}; showing the card without an image`);
    return undefined;
  }
}

/**
 * GitHub repository pages repeat the description in both tags: the title is
 * "GitHub - owner/repo: <description>" and the description is "<description> - owner/repo".
 * Show "owner/repo" as the title and the description once.
 */
function tidyGitHub(title: string, description: string | undefined): { title: string; description?: string } {
  const match = title.match(/^GitHub - ([\w.-]+\/[\w.-]+)(?::|$)/);
  if (!match) return { title, description };
  const repo = match[1];
  const suffix = ` - ${repo}`;
  return { title: repo, description: description?.endsWith(suffix) ? description.slice(0, -suffix.length) : description };
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function readMeta(html: string, property: string): string | undefined {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = readAttribute(tag, 'property') ?? readAttribute(tag, 'name');
    if (name === property) {
      const content = readAttribute(tag, 'content');
      if (content) return decodeEntities(content).trim();
    }
  }
  return undefined;
}

function readAttribute(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return match ? (match[2] ?? match[3]) : undefined;
}

function readTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? decodeEntities(match[1]).trim() || undefined : undefined;
}

const namedEntities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (entity, body: string) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isNaN(code) ? entity : String.fromCodePoint(code);
    }
    return namedEntities[body.toLowerCase()] ?? entity;
  });
}
