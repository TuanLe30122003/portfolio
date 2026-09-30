/** Generated "planet" artwork used until a real screenshot is provided. */
export function ProjectArt({ hue }: { hue: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle at 72% 28%, hsl(${hue} 90% 65% / 0.6), transparent 45%), linear-gradient(135deg, hsl(${hue} 55% 18%), hsl(${(hue + 20) % 360} 50% 7%))`,
      }}
    >
      <div className="starfield absolute inset-0 opacity-60" />
      <div
        className="absolute bottom-[-35%] left-[22%] aspect-square w-[62%] rounded-full shadow-[0_0_80px_-10px_currentColor]"
        style={{
          color: `hsl(${hue} 90% 60%)`,
          background: `radial-gradient(circle at 35% 30%, hsl(${hue} 100% 88%), hsl(${hue} 85% 55%) 45%, hsl(${hue} 70% 18%))`,
        }}
      />
    </div>
  );
}
