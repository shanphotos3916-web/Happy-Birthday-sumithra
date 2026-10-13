"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import type { Photo } from "@/config/birthday";
import { cn } from "@/lib/utils";

const ASPECT: Record<Photo["orientation"], string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

const TINTS = [
  "from-[#f4d3d6] via-[#e8c3cf] to-[#cbbfe2]",
  "from-[#f7e4d0] via-[#f0cdd0] to-[#d8a6b2]",
  "from-[#e9dcf0] via-[#f4d3d6] to-[#f7e9d7]",
  "from-[#d9b8c4] via-[#efd6d8] to-[#f8eee4]",
  "from-[#cbbfe2] via-[#e3cbe0] to-[#f4d3d6]",
];

type Props = {
  photo: Photo;
  index?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Override aspect ratio class. */
  aspect?: string;
  dark?: boolean;
};

export default function PhotoFrame({ photo, index = 0, sizes = "(max-width: 768px) 100vw, 50vw", priority, className, aspect, dark }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(photo.src) && !failed;
  return (
    <div className={cn("relative overflow-hidden", aspect ?? ASPECT[photo.orientation], className)}>
      {showImage ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          role="img"
          aria-label={`Photo placeholder: ${photo.alt}`}
          className={cn("absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br p-6 text-center", TINTS[index % TINTS.length])}
        >
          <div className="absolute inset-3 rounded-[2px] border border-white/50" aria-hidden />
          <div
            className="absolute inset-0 opacity-60 mix-blend-soft-light"
            style={{ background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9), transparent 55%)" }}
            aria-hidden
          />
          <ImageIcon className={cn("relative h-6 w-6", dark ? "text-burgundy/50" : "text-burgundy/40")} strokeWidth={1.2} aria-hidden />
          <span className="relative max-w-[16rem] font-display text-sm italic leading-snug text-burgundy/70">{photo.caption}</span>
        </div>
      )}
    </div>
  );
}
