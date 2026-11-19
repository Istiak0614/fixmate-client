"use client";

import { useState } from "react";
import Image from "next/image";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import type { ServiceCategory } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Service photo that never shows a broken image: if the URL fails to load (or is missing),
 * it falls back to a branded panel with the category icon.
 */
export function ServiceImage({
  src,
  alt,
  category,
  sizes,
  priority,
  className,
}: {
  src?: string;
  alt: string;
  category: ServiceCategory;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(!src);
  const Icon = CATEGORY_ICONS[category] ?? CATEGORY_ICONS.Electrical;

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {failed ? (
        <div className="bg-blueprint absolute inset-0 grid place-items-center bg-primary/10">
          <Icon className="size-12 text-primary/70" aria-hidden />
        </div>
      ) : (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </div>
  );
}