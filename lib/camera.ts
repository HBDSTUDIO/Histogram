export type CameraPhoto = { src: string; alt: string };
export type CameraDirection = "up" | "down" | "left" | "right";

export const cameraDirections: Record<CameraDirection, -1 | 1> = { up: -1, left: -1, down: 1, right: 1 };
export const cameraKeys: Record<string, CameraDirection> = {
  ArrowUp: "up", ArrowLeft: "left", ArrowDown: "down", ArrowRight: "right",
};
export function wrapPhoto(index: number, count: number) { return ((index % count) + count) % count; }

// Inner LCD corners measured in the supplied 1442 × 1179 image, clockwise.
export const lcdCorners = [[235, 130], [792, 296], [670, 707], [113, 545]] as const;

export function lcdTransform(scale: number) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = lcdCorners;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const denominator = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / denominator;
  const h = (dx1 * dy3 - dx3 * dy1) / denominator;
  const a = (x1 - x0 + g * x1) / 640;
  const b = (x3 - x0 + h * x3) / 480;
  const d = (y1 - y0 + g * y1) / 640;
  const e = (y3 - y0 + h * y3) / 480;
  return `matrix3d(${a},${d},0,${g / (640 * scale)},${b},${e},0,${h / (480 * scale)},0,0,1,0,${x0 * scale},${y0 * scale},0,1)`;
}
