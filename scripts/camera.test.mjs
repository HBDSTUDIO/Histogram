import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { makeRoutines } from "./sync-camera.mjs";
import { cameraDirections, cameraKeys, wrapPhoto, lcdTransform, lcdCorners } from "../lib/camera.ts";

const content = JSON.parse(await fs.readFile(new URL("../data/portfolio.json", import.meta.url), "utf8"));
const manifest = JSON.parse(await fs.readFile(new URL("../data/camera.json", import.meta.url), "utf8"));

test("ten reproducible, distinct routines each contain twenty different still photos", () => {
  const routines = makeRoutines(content.projects);
  assert.equal(routines.length, 10);
  assert.deepEqual(routines, makeRoutines(content.projects));
  assert.equal(new Set(routines.map((routine) => routine.map((p) => p.src).join(","))).size, 10);
  for (const routine of routines) {
    assert.equal(routine.length, 20);
    assert.equal(new Set(routine.map((photo) => photo.src)).size, 20);
    assert.ok(routine.every((photo) => !photo.animated));
  }
});

test("up/left go backwards, down/right go forwards, including both ends", () => {
  for (const key of ["ArrowUp", "ArrowLeft"]) {
    assert.equal(wrapPhoto(8 + cameraDirections[cameraKeys[key]], 20), 7);
    assert.equal(wrapPhoto(cameraDirections[cameraKeys[key]], 20), 19);
  }
  for (const key of ["ArrowDown", "ArrowRight"]) {
    assert.equal(wrapPhoto(8 + cameraDirections[cameraKeys[key]], 20), 9);
    assert.equal(wrapPhoto(19 + cameraDirections[cameraKeys[key]], 20), 0);
  }
  assert.equal(wrapPhoto(107, 20), 7);
  assert.equal(wrapPhoto(-43, 20), 17);
  assert.equal(cameraKeys.Enter, undefined);
});

test("LCD projection aligns all four original corners across responsive sizes", () => {
  for (const scale of [.15, .25, .5, 1]) {
    const m = lcdTransform(scale).slice(9, -1).split(",").map(Number);
    for (const [i, [x, y]] of [[0, 0], [640 * scale, 0], [640 * scale, 480 * scale], [0, 480 * scale]].entries()) {
      const w = m[3] * x + m[7] * y + 1;
      const projected = [(m[0] * x + m[4] * y + m[12]) / w, (m[1] * x + m[5] * y + m[13]) / w];
      projected.forEach((value, axis) => assert.ok(Math.abs(value - lcdCorners[i][axis] * scale) < 1e-6));
    }
  }
});

test("all shipped routines resolve to twenty small, existing local thumbnails", async () => {
  assert.equal(manifest.routines.length, 10);
  for (const routine of manifest.routines) {
    assert.equal(routine.length, 20);
    let bytes = 0;
    for (const photo of routine) {
      assert.match(photo.src, /^\/media\/camera\/[a-f0-9]{16}\.webp$/);
      bytes += (await fs.stat(new URL(`../public${photo.src}`, import.meta.url))).size;
    }
    assert.ok(bytes < 2 * 1024 * 1024, "A routine should stay below 2 MB");
  }
});
