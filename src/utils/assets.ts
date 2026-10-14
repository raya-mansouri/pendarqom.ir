export interface AssetEntry {
  src: string;
}

const therapistModules = import.meta.glob<{ default: { src: string } }>(
  "../assets/therapists/*.svg",
  { eager: true },
);
export const therapistPhotos: Record<string, AssetEntry> = Object.fromEntries(
  Object.entries(therapistModules).map(([path, mod]) => [
    path.split("/").pop()!.replace(".svg", ""),
    { src: mod.default.src },
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
