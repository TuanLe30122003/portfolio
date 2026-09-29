import Image from "next/image";
import { clsx } from "clsx";
import { isOptimizableImage } from "@/lib/remote-images";

/** Post cover from Notion, or a generated gradient when the page has none. */
export function PostCover({
  src,
  title,
  sizes,
  priority,
  className,
}: {
  src: string | null;
  title: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("relative overflow-hidden bg-ink-3", className)}>
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={!isOptimizableImage(src)}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{ background: placeholderGradient(title) }}
        >
          <div className="starfield absolute inset-0 opacity-40" />
          <span className="absolute bottom-3 right-5 font-display text-7xl font-black text-paper/15">
            {title.trim().charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

function placeholderGradient(seed: string): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  const hue = 180 + (Math.abs(hash) % 100); // cyan → violet
  return `radial-gradient(circle at 75% 20%, hsl(${hue} 85% 60% / 0.55), transparent 55%), linear-gradient(135deg, hsl(${hue} 45% 16%), hsl(${hue + 25} 45% 8%))`;
}
