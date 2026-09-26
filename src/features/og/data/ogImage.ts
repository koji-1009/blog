import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { SITE_TITLE } from '../../../shared/lib/site';
import { loadGoogleFont } from './googleFont';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** What an Open Graph image shows. */
export type OgContent =
  | { kind: 'post'; title: string; date: string; host: string }
  | { kind: 'site'; statement: string; host: string };

// The light palette from docs/design.md. The image is shown on other sites, so it has no dark variant.
const color = {
  surface: '#ffffff',
  foreground: '#1c2128',
  muted: '#59626e',
  accent: '#0b62c4',
  accentSoft: '#eef3fb',
  rail: '#cfd5dd',
};

// The rail's x position and the left edge of the text, as in the post list.
const RAIL_X = 150;
const TEXT_X = 232;
const NODE = 40;
const RING = 8;

type Node = { type: string; props: Record<string, unknown> };

function h(type: string, style: Record<string, unknown>, children?: unknown): Node {
  return { type, props: { style, children } };
}

// The site uses the reader's system UI font, and the Workers Builds image has only DejaVu fonts, so the
// renderer fetches Inter, the closest match, from Google Fonts.
const FONT_FAMILY = 'Inter';

let avatar: Promise<string> | undefined;
function loadAvatar() {
  avatar ??= sharp(join(process.cwd(), 'src/assets/avatar.jpg'))
    .resize(144)
    .png()
    .toBuffer()
    .then((data) => `data:image/png;base64,${data.toString('base64')}`);
  return avatar;
}

/** The site mark (an accent circle with a soft ring), placed on the rail beside a line of the given height. */
function siteMark(lineHeight: number): Node {
  const size = NODE + RING * 2;
  return h('div', {
    position: 'absolute',
    left: RAIL_X - TEXT_X - size / 2,
    top: (lineHeight - size) / 2,
    width: size,
    height: size,
    borderRadius: size,
    border: `${RING}px solid ${color.accentSoft}`,
    backgroundColor: color.accent,
  });
}

/** A post title's size: as large as the length allows while staying within three lines. */
function titleSize(title: string): number {
  if (title.length <= 36) return 76;
  if (title.length <= 60) return 64;
  return 56;
}

function headline(content: OgContent): Node {
  if (content.kind === 'post') {
    const dateLine = 40;
    const size = titleSize(content.title);
    return h('div', { display: 'flex', flexDirection: 'column' }, [
      h('div', { display: 'flex', position: 'relative', fontSize: 30, lineHeight: `${dateLine}px`, color: color.muted }, [
        siteMark(dateLine),
        content.date,
      ]),
      h(
        'div',
        { marginTop: 24, fontSize: size, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', color: color.foreground },
        content.title,
      ),
    ]);
  }
  const line = 62;
  return h(
    'div',
    { display: 'flex', position: 'relative', fontSize: 46, fontWeight: 600, lineHeight: `${line}px`, letterSpacing: '-0.01em', color: color.foreground },
    [siteMark(line), h('div', {}, content.statement)],
  );
}

function byline(host: string, avatarSrc: string): Node {
  return h('div', { display: 'flex', alignItems: 'center' }, [
    { type: 'img', props: { src: avatarSrc, width: 72, height: 72, style: { borderRadius: 72 } } },
    h('div', { display: 'flex', flexDirection: 'column', marginLeft: 24 }, [
      h('div', { fontSize: 30, fontWeight: 600, color: color.foreground }, SITE_TITLE),
      h('div', { fontSize: 24, color: color.muted }, host),
    ]),
  ]);
}

/** Renders a 1200 × 630 PNG in the site's style: the rail and node, the headline, and the author's byline. */
export async function renderOgImage(content: OgContent): Promise<Buffer> {
  // Every string in the image, so that the font subset has each character it draws.
  const text = [SITE_TITLE, content.host, ...(content.kind === 'post' ? [content.title, content.date] : [content.statement])].join('');
  const [fonts, avatarSrc] = await Promise.all([loadGoogleFont(FONT_FAMILY, [400, 600, 700], text), loadAvatar()]);
  const tree = h(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: OG_WIDTH,
      height: OG_HEIGHT,
      padding: `96px 96px 72px ${TEXT_X}px`,
      backgroundColor: color.surface,
      fontFamily: FONT_FAMILY,
    },
    [
      h('div', { position: 'absolute', left: RAIL_X - 2, top: 0, width: 4, height: OG_HEIGHT, backgroundColor: color.rail }),
      headline(content),
      byline(content.host, avatarSrc),
    ],
  );
  const svg = await satori(tree, { width: OG_WIDTH, height: OG_HEIGHT, fonts });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
