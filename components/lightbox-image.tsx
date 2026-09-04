"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PortfolioImage } from "@/lib/content";

export default function LightboxImage({ image, sizes = "100vw" }: { image: PortfolioImage; sizes?: string }) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = ""; };
  }, [open]);

  const close = () => { setOpen(false); setScale(1); };
  return <>
    <button type="button" className="lightbox-trigger" onClick={() => setOpen(true)} aria-label={`${image.alt} 크게 보기`}>
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} unoptimized={image.animated} />
    </button>
    {open && <div className="lightbox" role="dialog" aria-modal="true" aria-label={image.alt} onClick={close}>
      <button type="button" className="lightbox-close" onClick={close} aria-label="닫기">×</button>
      <div className="lightbox-controls" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={() => setScale((value) => Math.max(1, value - .25))} aria-label="축소">−</button>
        <button type="button" onClick={() => setScale(1)} aria-label="원래 크기">{Math.round(scale * 100)}%</button>
        <button type="button" onClick={() => setScale((value) => Math.min(3, value + .25))} aria-label="확대">+</button>
      </div>
      <div className="lightbox-frame" onClick={(event) => event.stopPropagation()}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="90vw" unoptimized={image.animated} style={{ transform: `scale(${scale})` }} />
      </div>
    </div>}
  </>;
}
