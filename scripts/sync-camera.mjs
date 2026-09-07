import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function makeRoutines(projects) {
  const flatten = (items) => items.flatMap((item) => [item, ...flatten(item.children ?? [])]);
  const seen = new Set();
  const groups = flatten(projects).map((project) => ({
    slug: project.slug,
    images: [...project.images, ...project.wallImages].filter((photo) => {
      if (photo.animated || seen.has(photo.src)) return false;
      seen.add(photo.src);
      return true;
    }),
  })).filter((group) => group.images.length);
  if (seen.size < 20) throw new Error("카메라에는 서로 다른 정지 사진이 20장 이상 필요합니다.");
  return Array.from({ length: 10 }, (_, routine) => {
    let seed = 20260907 + routine * 7919;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const selected = new Set();
    const photos = [];
    let previousGroup = "";
    while (photos.length < 20) {
      const available = groups.filter((group) => group.images.some((photo) => !selected.has(photo.src)));
      const varied = available.filter((group) => group.slug !== previousGroup);
      const candidates = varied.length ? varied : available;
      const group = candidates[Math.floor(random() * candidates.length)];
      const images = group.images.filter((photo) => !selected.has(photo.src));
      const photo = images[Math.floor(random() * images.length)];
      selected.add(photo.src);
      photos.push(photo);
      previousGroup = group.slug;
    }
    return photos;
  });
}

export async function syncCameraAssets() {
  const output = path.join(root, "public/media/camera");
  await fs.mkdir(output, { recursive: true });
  const body = path.join(output, "body.png");
  const original = path.join(root, "..", "디카.png".normalize("NFD"));
  try {
    await fs.copyFile(original, body);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await fs.access(body); // Published checkouts use the retained, unmodified original.
  }
  const content = JSON.parse(await fs.readFile(path.join(root, "data/portfolio.json"), "utf8"));
  const routines = makeRoutines(content.projects);
  const photos = new Map(routines.flat().map((photo) => [photo.src, photo]));
  const converted = new Map();
  for (const photo of photos.values()) {
    const bytes = await fs.readFile(path.join(root, "public", photo.src));
    const hash = createHash("sha256").update(bytes).update("camera-800x600-q78-v1").digest("hex").slice(0, 16);
    const filename = `${hash}.webp`;
    const target = path.join(output, filename);
    try { await fs.access(target); } catch {
      await sharp(bytes).rotate().resize({ width: 800, height: 600, fit: "inside", withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(target);
    }
    converted.set(photo.src, { src: `/media/camera/${filename}`, alt: photo.alt });
  }
  const manifest = { routines: routines.map((routine) => routine.map((photo) => converted.get(photo.src))) };
  await fs.writeFile(path.join(root, "data/camera.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  // Remove only obsolete thumbnails owned by this generator.
  const retained = new Set([...converted.values()].map((photo) => path.basename(photo.src)));
  for (const filename of await fs.readdir(output)) {
    if (/^[a-f0-9]{16}\.webp$/.test(filename) && !retained.has(filename)) await fs.unlink(path.join(output, filename));
  }
  console.log(`카메라: 10개 루틴 × 20장, 최적화 사진 ${photos.size}개`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncCameraAssets().catch((error) => { console.error(error); process.exitCode = 1; });
}
