import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const logoFile = path.join(process.cwd(), "src/assets/logo.png");
const defaultOg = path.join(process.cwd(), "public/og-default.png");

const badgeSvg = `<svg width="136" height="136" viewBox="0 0 136 136" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="134" height="134" rx="28" fill="#fffdf8" fill-opacity="0.96" stroke="#8a651c" stroke-opacity="0.5" stroke-width="2"/>
</svg>`;

const jpeg = { quality: 84, chromaSubsampling: "4:4:4" } as const;

async function badge(): Promise<Buffer> {
  return sharp({
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
}

export async function shareJpeg(source?: string, style: "cover" | "poster" = "cover"): Promise<Buffer> {
  const mark = await badge();

  if (!source || !fs.existsSync(source)) {
    return sharp(defaultOg).jpeg(jpeg).toBuffer();
  }

  if (style === "poster") {
    const backdrop = await sharp(source)
      .resize(1200, 630, { fit: "cover" })
      .blur(40)
      .modulate({ brightness: 0.55, saturation: 0.8 })
      .toBuffer();
    const poster = await sharp(source)
      .resize({ height: 566, fit: "inside", withoutEnlargement: true })
      .toBuffer();

    return sharp(backdrop)
      .composite([{ input: poster, gravity: "center" }, { input: mark, top: 454, left: 1024 }])
      .jpeg(jpeg)
      .toBuffer();
  }

  return sharp(source)
    .resize(1200, 630, { fit: "cover" })
    .composite([{ input: mark, top: 454, left: 1024 }])
    .jpeg(jpeg)
    .toBuffer();
}

export function imageResponse(body: Buffer): Response {
  return new Response(new Uint8Array(body), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=604800" },
  });
}
