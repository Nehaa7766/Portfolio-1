import { Quote } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { CONTACT_QUOTE } from "@/data/contact";

const NODES: { x: number; y: number; r: number }[] = [
  { x: 50, y: 12, r: 2.4 },
  { x: 22, y: 30, r: 1.8 },
  { x: 78, y: 28, r: 2 },
  { x: 38, y: 50, r: 2.6 },
  { x: 66, y: 54, r: 2.2 },
  { x: 14, y: 64, r: 1.6 },
  { x: 50, y: 78, r: 2.4 },
  { x: 86, y: 72, r: 1.8 },
  { x: 30, y: 88, r: 2 },
  { x: 72, y: 90, r: 1.6 },
];

const LINKS: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [3, 5],
  [4, 6], [5, 6], [6, 8], [6, 7], [7, 9], [4, 7],
];

/**
 * Decorative network constellation — a lightweight SVG (no WebGL) that evokes
 * connection without the cost of a 3D scene.
 */
export function ConnectVia() {
  return (
    <Panel
      title="Connect Via"
      className="lg:col-span-3"
      bodyClassName="flex flex-col gap-5"
    >
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <svg viewBox="0 0 100 100" className="h-52 w-full">
          {LINKS.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="#0ea5e9"
              strokeWidth="0.3"
              strokeOpacity="0.35"
            />
          ))}
          {NODES.map((n, i) => (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill="#38bdf8"
              className="animate-pulse"
              style={{ animationDelay: `${(i % 5) * 0.4}s` }}
            />
          ))}
        </svg>
      </div>

      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-center">
        <Quote size={16} className="mx-auto mb-2 text-sky-600 dark:text-sky-400" />
        <p className="text-sm italic leading-relaxed text-sky-700 dark:text-sky-200/80">{CONTACT_QUOTE}</p>
      </div>
    </Panel>
  );
}
