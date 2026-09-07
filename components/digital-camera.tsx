"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { cameraDirections, cameraKeys, lcdTransform, wrapPhoto, type CameraDirection, type CameraPhoto } from "@/lib/camera";

const buttons: { direction: CameraDirection; x: number; y: number }[] = [
  { direction: "up", x: 931, y: 555 },
  { direction: "left", x: 852, y: 600 },
  { direction: "right", x: 968, y: 634 },
  { direction: "down", x: 893, y: 676 },
];

export default function DigitalCamera({ routines }: { routines: CameraPhoto[][] }) {
  const stage = useRef<HTMLDivElement>(null);
  const sequence = useRef<CameraPhoto[]>([]);
  const desiredIndex = useRef(0);
  const request = useRef(0);
  const alive = useRef(false);
  const loaders = useRef(new Map<string, Promise<HTMLImageElement>>());
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scale, setScale] = useState(0);
  const [display, setDisplay] = useState<{ photo: CameraPhoto; index: number } | null>(null);
  const [pressed, setPressed] = useState<CameraDirection | null>(null);
  const [busy, setBusy] = useState(true);
  const [failed, setFailed] = useState(false);

  function load(photo: CameraPhoto) {
    const cached = loaders.current.get(photo.src);
    if (cached) return cached;
    const pending = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.decoding = "async";
      image.onload = async () => {
        try { await image.decode(); } catch { /* A loaded image remains usable. */ }
        resolve(image);
      };
      image.onerror = () => reject(new Error("Image unavailable"));
      image.src = photo.src;
    });
    loaders.current.set(photo.src, pending);
    void pending.catch(() => loaders.current.delete(photo.src));
    return pending;
  }

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1442));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    alive.current = true;
    const navigation = request;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Randomness runs only in the browser, once per mount; no hydration mismatch.
    if (!sequence.current.length) {
      const random = new Uint32Array(1);
      window.crypto.getRandomValues(random);
      sequence.current = routines[random[0] % routines.length] ?? [];
    }
    const photos = sequence.current;
    async function start() {
      for (let index = 0; index < photos.length && !cancelled; index++) {
        try {
          await load(photos[index]);
          if (cancelled) return;
          desiredIndex.current = index;
          setDisplay({ photo: photos[index], index });
          setBusy(false);
          // Prioritize the two neighbours, then warm only this selected routine.
          const order = [wrapPhoto(index + 1, photos.length), wrapPhoto(index - 1, photos.length),
            ...photos.map((_, n) => n)].filter((n, i, values) => n !== index && values.indexOf(n) === i);
          let cursor = 0;
          async function warm() {
            if (cancelled || cursor >= order.length) return;
            const pair = order.slice(cursor, cursor + 2);
            cursor += 2;
            await Promise.allSettled(pair.map((n) => load(photos[n])));
            if (!cancelled) timer = setTimeout(warm, 180);
          }
          timer = setTimeout(warm, 180);
          return;
        } catch { /* Keep the LCD on while trying the next photo in this routine. */ }
      }
      if (!cancelled) { setBusy(false); setFailed(true); }
    }
    void start();
    return () => {
      cancelled = true;
      alive.current = false;
      navigation.current++;
      clearTimeout(timer);
      if (pressTimer.current) clearTimeout(pressTimer.current);
    };
  }, [routines]);

  async function move(direction: CameraDirection) {
    if (!display || !sequence.current.length) return;
    const photos = sequence.current;
    const index = wrapPhoto(desiredIndex.current + cameraDirections[direction], photos.length);
    desiredIndex.current = index;
    const token = ++request.current;
    setPressed(direction);
    setBusy(true);
    setFailed(false);
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => setPressed(null), 140);
    try {
      await load(photos[index]);
      if (!alive.current || request.current !== token) return;
      setDisplay({ photo: photos[index], index });
    } catch {
      if (alive.current && request.current === token) setFailed(true);
    } finally {
      if (alive.current && request.current === token) setBusy(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const direction = cameraKeys[event.key];
    if (!direction) return;
    event.preventDefault();
    if (!event.repeat) void move(direction);
  }

  return <div ref={stage} className="digital-camera" role="group" aria-label="Digital camera photo album" onKeyDown={onKeyDown} data-loading={busy}>
    {/* The supplied PNG includes its own transparent cast shadow. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="camera-body" src="/media/camera/body.png?v=d4ea85706d2c" width={1414} height={1179} alt="Nikon digital camera" draggable={false} fetchPriority="high" />
    <div className="camera-screen" aria-hidden="true" style={{ transform: scale ? lcdTransform(scale) : undefined, visibility: scale && display ? "visible" : "hidden" }}>
      {display && <img key={display.photo.src} className="camera-photo" src={display.photo.src} alt="" draggable={false} /> /* eslint-disable-line @next/next/no-img-element */}
    </div>
    {buttons.map(({ direction, x, y }) => <span key={direction} aria-hidden="true"
      className={`camera-press${pressed === direction ? " is-pressed" : ""}`}
      style={{ left: `${x / 1442 * 100}%`, top: `${y / 1179 * 100}%` }} />)}
    <div className="camera-controls" style={{ "--camera-center": `${36 * scale}px` } as CSSProperties}>
    {buttons.map(({ direction }) => <button
      key={direction} type="button" className={`camera-button camera-button-${direction}${pressed === direction ? " is-pressed" : ""}`}
      aria-label={`${cameraDirections[direction] < 0 ? "Previous" : "Next"} photo (${direction})`}
      disabled={!display} onClick={() => void move(direction)}
    />)}
    </div>
    <span className="camera-sr-only" role="status" aria-live="polite" aria-atomic="true">
      {failed ? "Photo could not load. Try the next photo." : display ? `${display.index + 1} of 20. ${display.photo.alt}` : "Loading photos"}
    </span>
  </div>;
}
