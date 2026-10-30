import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const coverDir = path.join(root, "src/assets/articles");
const logoFile = path.join(root, "src/assets/logo.png");
const defaultOg = path.join(root, "public/og-default.png");

const badgeSvg = `<svg width="136" height="136" viewBox="0 0 136 136" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="134" height="134" rx="28" fill="#fffdf8" fill-opacity="0.96" stroke="#8a651c" stroke-opacity="0.5" stroke-width="2"/>
</svg>`;

const response = (body: Buffer, type: string) =>
  new Response(new Uint8Array(body), {
    headers: { "Content-Type": type, "Cache-Control": "public, max-age=604800" },
  });

const jpeg = { quality: 84, chromaSubsampling: "4:4:4" } as const;

export const getStaticPaths = (async () => {
  const articles = (await getCollection("articles")).filter((a) => !a.data.draft);
  return articles.map((a) => ({ params: { slug: a.id }, props: { id: a.id } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { id } = props as { id: string };
  const coverFile = path.join(coverDir, `${id}.webp`);

  if (!fs.existsSync(coverFile)) {
    return response(await sharp(defaultOg).jpeg(jpeg).toBuffer(), "image/jpeg");
  }

  const badge = await sharp({
    create: { width: 136, height: 136, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: Buffer.from(badgeSvg), top: 0, left: 0 },
      {
        input: await sharp(logoFile)
          .resize(96, 96, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .toBuffer(),
        top: 20,
        left: 20,
      },
    ])
    .png()
    .toBuffer();

  const out = await sharp(coverFile)
    .resize(1200, 630, { fit: "cover" })
    .composite([{ input: badge, top: 454, left: 1024 }])
    .jpeg(jpeg)
    .toBuffer();

  return response(out, "image/jpeg");
};
