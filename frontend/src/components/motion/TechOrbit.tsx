import { clsx } from "clsx";
import { techIcons, type TechIconName } from "@/content/tech-icons";

interface Ring {
  icons: TechIconName[];
  /** Distance of the ring from the edge of the system, in % of its size. */
  inset: number;
  /** Orb diameter in % of the whole system. */
  orbSize: number;
  /** Seconds per revolution. */
  duration: number;
  reverse?: boolean;
  /** Starting angle in degrees (0 = right, -90 = top). */
  offset: number;
  dashed?: boolean;
}

interface TechOrbitProps {
  center: TechIconName;
  inner: TechIconName[];
  outer: TechIconName[];
  className?: string;
}

/**
 * Decorative "solar system" of technology logos: one icon in the centre and
 * two rings orbiting it in opposite directions. Icons counter-rotate so they
 * stay upright. Spinning uses the CSS `rotate` property, leaving `transform`
 * free for GSAP (parallax on the wrapper, intro scale on each `data-orb`).
 */
export function TechOrbit({ center, inner, outer, className }: TechOrbitProps) {
  const rings: Ring[] = [
    {
      icons: outer,
      inset: 4,
      orbSize: 10.5,
      duration: 90,
      reverse: true,
      offset: -90 + 180 / outer.length,
      dashed: true,
    },
    { icons: inner, inset: 23, orbSize: 12.5, duration: 55, offset: -90 },
  ];

  return (
    <div aria-hidden className={clsx("relative aspect-square", className)}>
      <div className="absolute inset-[30%] rounded-full bg-accent/20 blur-3xl" />

      {rings.map((ring) => {
        const ringFraction = (100 - 2 * ring.inset) / 100;
        const spin = { animationDuration: `${ring.duration}s` };
        return (
          <div
            key={ring.inset}
            className={clsx("absolute rounded-full border border-line", ring.dashed && "border-dashed")}
            style={{ inset: `${ring.inset}%` }}
          >
            <div
              className={clsx("absolute inset-0 animate-orbit", ring.reverse && "[animation-direction:reverse]")}
              style={spin}
            >
              {ring.icons.map((name, i) => {
                const angle = ((ring.offset + (360 / ring.icons.length) * i) * Math.PI) / 180;
                return (
                  <div
                    key={name}
                    data-orb
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${50 + 50 * Math.cos(angle)}%`,
                      top: `${50 + 50 * Math.sin(angle)}%`,
                      width: `${ring.orbSize / ringFraction}%`,
                    }}
                  >
                    {/* Counter-spin keeps the logo upright while the ring turns. */}
                    <div
                      className={clsx("animate-orbit", !ring.reverse && "[animation-direction:reverse]")}
                      style={spin}
                    >
                      <Orb name={name} glow={ring.reverse ? "violet" : "cyan"} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div data-orb className="absolute left-1/2 top-1/2 w-[24%] -translate-x-1/2 -translate-y-1/2">
        <Orb name={center} glow="cyan" large />
      </div>
    </div>
  );
}

function Orb({ name, glow, large }: { name: TechIconName; glow: "cyan" | "violet"; large?: boolean }) {
  return (
    <div
      className={clsx(
        "grid aspect-square place-items-center rounded-full border bg-ink-2/80 backdrop-blur-sm",
        large ? "border-accent/40" : "border-line",
        glow === "cyan"
          ? "shadow-[0_0_40px_-10px_rgb(95_227_247/0.6)]"
          : "shadow-[0_0_40px_-10px_rgb(167_139_250/0.6)]",
      )}
    >
      <svg viewBox="0 0 24 24" className={clsx("fill-paper", large ? "w-[46%]" : "w-[50%]")}>
        <path d={techIcons[name].path} />
      </svg>
    </div>
  );
}
