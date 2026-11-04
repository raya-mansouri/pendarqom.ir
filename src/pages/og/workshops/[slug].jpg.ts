import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import path from "node:path";
import { imageResponse, shareJpeg } from "../../../utils/og";

const posterDir = path.join(process.cwd(), "src/assets/workshops");

export const getStaticPaths = (async () => {
  const workshops = await getCollection("workshops");
  return workshops.map((w) => ({ params: { slug: w.id }, props: { id: w.id } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { id } = props as { id: string };
  return imageResponse(await shareJpeg(path.join(posterDir, `${id}.webp`), "poster"));
};
