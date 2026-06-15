/**
 * Lightweight 2D placeholder shown while a 3D scene chunk is being
 * dynamically imported (keeps Three.js out of the base bundle).
 */
export function SceneLoader({ label = "Loading 3D scene…" }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-950/40">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-sky-400" />
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}
