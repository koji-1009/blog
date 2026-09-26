/** A font face in the form satori takes. */
export interface FontFace {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600 | 700;
  style: 'normal';
}

const TIMEOUT_MS = 10_000;

/**
 * Fetches `family` in each of `weights` from the Google Fonts CSS API, subset to the characters in
 * `text`. Without a browser User-Agent the API serves TrueType, which satori reads (it cannot read
 * WOFF2), and the subset keeps each face to a few kilobytes. Any script Google Fonts covers works,
 * so a Japanese edition only needs a Japanese family here.
 *
 * Throws when a request fails: an Open Graph image cannot be drawn without a font, and a failed
 * build leaves the deployed site as it was.
 */
export async function loadGoogleFont(family: string, weights: FontFace['weight'][], text: string): Promise<FontFace[]> {
  const url = new URL('https://fonts.googleapis.com/css2');
  url.searchParams.set('family', `${family}:wght@${weights.join(';')}`);
  url.searchParams.set('text', text);
  const css = await fetchOk(url.href).then((response) => response.text());

  const faces = [...css.matchAll(/font-weight: (\d+);\s*src: url\((.+?)\) format\('(?:truetype|opentype)'\)/g)];
  if (faces.length !== weights.length) {
    throw new Error(`[og-image] Google Fonts returned ${faces.length} of ${weights.length} faces of ${family}`);
  }
  return Promise.all(
    faces.map(async ([, weight, src]) => ({
      name: family,
      data: await fetchOk(src).then((response) => response.arrayBuffer()),
      weight: Number(weight) as FontFace['weight'],
      style: 'normal' as const,
    })),
  );
}

async function fetchOk(url: string): Promise<Response> {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`[og-image] ${url}: HTTP ${response.status}`);
  return response;
}
