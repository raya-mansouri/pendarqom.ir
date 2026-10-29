import type { ImageMetadata } from "astro";

export interface AssetEntry {
  src: string;
}

const therapistModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/therapists/*.webp",
  { eager: true },
);
export const therapistPhotos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(therapistModules).map(([path, mod]) => [
    path.split("/").pop()!.replace(".webp", ""),
    mod.default,
  ]),
);

const workshopModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/workshops/*.webp",
  { eager: true },
);
export const workshopPosters: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(workshopModules).map(([path, mod]) => [
    path.split("/").pop()!.replace(".webp", ""),
    mod.default,
  ]),
);

const articleModules = import.meta.glob<{ default: { src: string } }>(
  "../assets/articles/*.svg",
  { eager: true },
);
export const articleCovers: Record<string, AssetEntry> = Object.fromEntries(
  Object.entries(articleModules).map(([path, mod]) => [
    path.split("/").pop()!.replace(".svg", ""),
    { src: mod.default.src },
  ]),
);
