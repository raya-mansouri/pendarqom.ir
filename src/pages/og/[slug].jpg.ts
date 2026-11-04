import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import path from "node:path";
import { imageResponse, shareJpeg } from "../../utils/og";

const coverDir = path.join(process.cwd(), "src/assets/articles");

export const getStaticPaths = (async () => {
  const articles = (await getCollection("articles")).filter((a) => !a.data.draft);
  return articles.map((a) => ({ params: { slug: a.id }, props: { id: a.id } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { id } = props as { id: string };
  return imageResponse(await shareJpeg(path.join(coverDir, `${id}.webp`)));
};
