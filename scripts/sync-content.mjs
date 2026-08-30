import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const sourceRoot = path.join(projectRoot, "portfolio-content");
const outputRoot = path.join(projectRoot, "public", "media", "portfolio");
const floatOutputRoot = path.join(projectRoot, "public", "media", "float");
const dataFile = path.join(projectRoot, "data", "portfolio.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif"]);
const collator = new Intl.Collator("ko", { numeric: true, sensitivity: "base" });

function orderedName(name) {
  const match = name.match(/^\s*(\d+)[\s._-]+(.+)$/u);
  return match
    ? { order: Number(match[1]), title: match[2].trim() }
    : { order: 9999, title: name.trim() };
}

function slugify(value, fallback) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function comparable(value) {
  return value.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "");
}

function imageOrder(name) {
  const stem = path.basename(name, path.extname(name));
  const leading = stem.match(/^\s*(\d+)/u);
  const wallLeading = stem.match(/^\s*wall[- _]?(\d+)/iu);
  const order = leading ? Number(leading[1]) : wallLeading ? Number(wallLeading[1]) : 9999;
  const isWall = /(?:^|[- _])wall(?:$|[- _]|\d)/iu.test(stem) || /^wall[- _]?\d/iu.test(stem);
  return { order, isWall };
}

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function directories(target) {
  if (!(await exists(target))) return [];
  const entries = await fs.readdir(target, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith(".")).map((entry) => entry.name).sort(collator.compare);
}

async function keyValues(target) {
  if (!(await exists(target))) return {};
  const text = await fs.readFile(target, "utf8");
  return Object.fromEntries(text.split(/\r?\n/u).map((line) => line.trim()).filter((line) => line && !line.startsWith("#")).map((line) => {
    const separator = line.indexOf(":");
    if (separator < 0) return null;
    return [line.slice(0, separator).trim().toLowerCase(), line.slice(separator + 1).trim()];
  }).filter(Boolean));
}

function field(meta, ...keys) {
  for (const key of keys) {
    const value = meta[key.toLowerCase()];
    if (value) return value;
  }
  return "";
}

function numberField(value, fallback) {
  const parsed = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function roleFields(meta) {
  const fallbackContribution = numberField(field(meta, "기여도", "contribution"), 100);
  const combined = field(meta, "역할 및 기여도", "역할별 기여도", "rolecontributions", "roles");
  const values = combined || field(meta, "역할", "role");
  return values.split(/[,|/]/u).map((value) => value.trim()).filter(Boolean).map((value) => {
    const match = value.match(/^(.*?)(?:\s*[:=]\s*|\s+)(\d+(?:\.\d+)?)%?$/u);
    return match
      ? { name: match[1].trim(), contribution: numberField(match[2], fallbackContribution) }
      : { name: value, contribution: fallbackContribution };
  });
}

async function main() {
  if (!(await exists(sourceRoot))) throw new Error("portfolio-content 폴더가 없습니다.");

  const mainOrder = new Map();
  for (const name of await directories(path.join(sourceRoot, "00 Main"))) {
    const parsed = orderedName(name);
    mainOrder.set(comparable(parsed.title), parsed.order);
  }

  const hiddenSectionNames = new Set(["main", "float"]);
  const sectionFolders = (await directories(sourceRoot)).filter((name) => !hiddenSectionNames.has(orderedName(name).title.toLowerCase()));
  const projects = [];
  const sections = [];
  const usedSlugs = new Set();

  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.rm(floatOutputRoot, { recursive: true, force: true });
  await fs.mkdir(outputRoot, { recursive: true });
  await fs.mkdir(floatOutputRoot, { recursive: true });

  const floatImages = [];
  const floatRoot = path.join(sourceRoot, "Float");
  const floatFiles = (await exists(floatRoot) ? await fs.readdir(floatRoot, { withFileTypes: true }) : [])
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((a, b) => imageOrder(a).order - imageOrder(b).order || collator.compare(a, b));
  for (const [index, imageName] of floatFiles.slice(0, 4).entries()) {
    const outputName = `${String(index + 1).padStart(2, "0")}.webp`;
    const outputPath = path.join(floatOutputRoot, outputName);
    await sharp(path.join(floatRoot, imageName)).rotate().resize({ width: 3200, withoutEnlargement: true }).webp({ quality: 90, effort: 5 }).toFile(outputPath);
    const imageMeta = await sharp(outputPath).metadata();
    floatImages.push({ src: `/media/float/${outputName}`, width: imageMeta.width ?? 1600, height: imageMeta.height ?? 1200, alt: `Park Hojun image ${index + 1}` });
  }

  for (const sectionFolder of sectionFolders) {
    const sectionParsed = orderedName(sectionFolder);
    const sectionRoot = path.join(sourceRoot, sectionFolder);
    const contentsRoot = (await exists(path.join(sectionRoot, "contents"))) ? path.join(sectionRoot, "contents") : sectionRoot;
    const sectionCategories = new Set();

    async function buildProject(projectFolder, projectRootPath, parentSlug = "") {
      const projectParsed = orderedName(projectFolder);
      const meta = await keyValues(path.join(projectRootPath, "info.txt"));
      const title = field(meta, "제목", "title") || projectParsed.title;
      const localSlug = slugify(field(meta, "슬러그", "slug") || title, `project-${sectionParsed.order}-${projectParsed.order}`);
      const slug = parentSlug ? `${parentSlug}/${localSlug}` : localSlug;
      if (usedSlugs.has(slug)) throw new Error(`중복 슬러그: ${slug}`);
      usedSlugs.add(slug);

      const entries = await fs.readdir(projectRootPath, { withFileTypes: true });
      const sourceImages = entries.filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())).map((entry) => entry.name).sort((a, b) => imageOrder(a).order - imageOrder(b).order || collator.compare(a, b));
      const childFolders = entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith(".")).map((entry) => entry.name).sort(collator.compare);
      const children = [];
      for (const childFolder of childFolders) children.push(await buildProject(childFolder, path.join(projectRootPath, childFolder), slug));
      if (sourceImages.length === 0 && children.length === 0) throw new Error(`${projectFolder} 폴더에 이미지 또는 하위 프로젝트가 없습니다.`);

      const projectOutput = path.join(outputRoot, ...slug.split("/"));
      await fs.mkdir(projectOutput, { recursive: true });
      const images = [];
      const wallImages = [];
      const galleryBlocks = [];
      let normalCountBeforeWall = null;
      for (const [index, imageName] of sourceImages.entries()) {
        const outputName = `${String(index + 1).padStart(2, "0")}.webp`;
        const outputPath = path.join(projectOutput, outputName);
        await sharp(path.join(projectRootPath, imageName)).rotate().resize({ width: 3200, withoutEnlargement: true }).webp({ quality: 90, effort: 5 }).toFile(outputPath);
        const imageMeta = await sharp(outputPath).metadata();
        const image = { src: `/media/portfolio/${slug}/${outputName}`, width: imageMeta.width ?? 1600, height: imageMeta.height ?? 1200, alt: field(meta, `이미지${index + 1}설명`, `image${index + 1}alt`) || `${title} ${index + 1}` };
        if (imageOrder(imageName).isWall) {
          if (normalCountBeforeWall === null) normalCountBeforeWall = images.length;
          wallImages.push(image);
          const lastBlock = galleryBlocks.at(-1);
          if (lastBlock?.type === "wall") lastBlock.images.push(image);
          else galleryBlocks.push({ type: "wall", images: [image] });
        } else {
          images.push(image);
          galleryBlocks.push({ type: "image", images: [image] });
        }
      }
      const cover = images[0] ?? wallImages[0] ?? children[0]?.cover;
      const category = field(meta, "카테고리", "category") || projectParsed.title;
      const roles = roleFields(meta);
      sectionCategories.add(category);
      const homeOrder = parentSlug ? null : mainOrder.get(comparable(title)) ?? mainOrder.get(comparable(slug)) ?? null;
      return {
        slug, title, section: sectionParsed.title, sectionOrder: sectionParsed.order, projectOrder: projectParsed.order,
        category, summary: "", year: field(meta, "연도", "year"), role: roles.map((item) => item.name).join(", "), roles,
        contribution: numberField(field(meta, "기여도", "contribution"), 100), client: field(meta, "클라이언트", "client"), cover,
        images, wallImages, wallInsertAfter: normalCountBeforeWall ?? 0, galleryBlocks, featured: homeOrder !== null, homeOrder,
        children, isCollection: children.length > 0,
      };
    }

    for (const projectFolder of await directories(contentsRoot)) {
      projects.push(await buildProject(projectFolder, path.join(contentsRoot, projectFolder)));
    }

    sections.push({
      title: sectionParsed.title,
      order: sectionParsed.order,
      categories: [...sectionCategories],
    });
  }

  projects.sort((a, b) => a.sectionOrder - b.sectionOrder || a.projectOrder - b.projectOrder);
  sections.sort((a, b) => a.order - b.order);

  const settings = await keyValues(path.join(sourceRoot, "site.txt"));
  const siteSettings = {
    name: field(settings, "이름", "name") || "Park Hojun",
    label: field(settings, "라벨", "label") || "Portfolio",
    years: field(settings, "기간", "years") || "2020 to 2026",
    phone: field(settings, "전화번호", "phone"),
    email: field(settings, "이메일", "email"),
    instagram: field(settings, "인스타그램", "instagram"),
    instagramUrl: field(settings, "인스타그램링크", "instagramurl") || "https://instagram.com/",
  };

  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, `${JSON.stringify({ siteSettings, floatImages, sections, projects }, null, 2)}\n`, "utf8");
  console.log(`완료: 프로젝트 ${projects.length}개, 웹 이미지 ${projects.reduce((sum, project) => sum + project.images.length + project.wallImages.length, 0)}개, Float ${floatImages.length}개`);
}

main().catch((error) => {
  console.error(`콘텐츠 변환 실패: ${error.message}`);
  process.exitCode = 1;
});
