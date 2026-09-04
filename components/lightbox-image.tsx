"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PortfolioImage } from "@/lib/content";

export default function LightboxImage({ image, sizes = "100vw" }: { image: PortfolioImage; sizes?: string }) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ x: 0, y: 0, startX: 0, startY: 0, startScale: 1, distance: 0 });

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = ""; };
  }, [open]);

  const close = () => { setOpen(false); setScale(1); setPosition({ x: 0, y: 0 }); pointers.current.clear(); };
  const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.current.values()];
    if (points.length === 1) gesture.current = { ...gesture.current, x: position.x, y: position.y, startX: points[0].x, startY: points[0].y, startScale: scale, distance: 0 };
    if (points.length === 2) gesture.current.distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  };
  const pointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.current.values()];
    if (points.length === 1) setPosition({ x: gesture.current.x + event.clientX - gesture.current.startX, y: gesture.current.y + event.clientY - gesture.current.startY });
    if (points.length === 2 && gesture.current.distance > 0) {
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      setScale(Math.min(4, Math.max(1, gesture.current.startScale * distance / gesture.current.distance)));
    }
  };
  const pointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    const point = [...pointers.current.values()][0];
    if (point) gesture.current = { ...gesture.current, x: position.x, y: position.y, startX: point.x, startY: point.y, startScale: scale };
  };
  return <>
    <button type="button" className="lightbox-trigger" onClick={() => setOpen(true)} aria-label={`${image.alt} 크게 보기`}>
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} unoptimized={image.animated} />
    </button>
    {open && <div className="lightbox" role="dialog" aria-modal="true" aria-label={image.alt} onClick={close}>
      <button type="button" className="lightbox-close" onClick={close} aria-label="닫기">×</button>
      <div className="lightbox-frame" onClick={(event) => event.stopPropagation()} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="90vw" unoptimized={image.animated} style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }} />
      </div>
    </div>}
  </>;
}
