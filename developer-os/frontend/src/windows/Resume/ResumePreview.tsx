import { Download } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RESUME, PREVIEW_SKILLS, PREVIEW_EDUCATION } from "@/data/resume";

/** Five-dot level meter. */
function Level({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i < level ? "bg-sky-400" : "bg-zinc-700"}`}
        />
      ))}
    </span>
  );
}

export function ResumePreview() {
  return (
    <div className="flex w-80 shrink-0 flex-col gap-4">
      <SectionHeader>Resume Preview</SectionHeader>

      {/* Mini "paper" */}
      <div className="rounded-lg border border-white/10 bg-[#0b1322] p-5 text-[11px] leading-relaxed">
        <h3 className="text-lg font-bold text-white">{RESUME.name}</h3>
        <p className="mb-3 text-xs text-sky-300">{RESUME.role}</p>

        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          Profile
        </p>
        <p className="mb-3 text-zinc-400">
          Software Engineer focused on building scalable, user-friendly applications.
        </p>

        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          Education
        </p>
        <p className="text-zinc-300">{PREVIEW_EDUCATION.degree}</p>
        <p className="mb-3 text-zinc-500">
          {PREVIEW_EDUCATION.field} · {PREVIEW_EDUCATION.years}
        </p>

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          Skills
        </p>
        <ul className="mb-3 flex flex-col gap-1.5">
          {PREVIEW_SKILLS.map((s) => (
            <li key={s.name} className="flex items-center justify-between">
              <span className="text-zinc-300">{s.name}</span>
              <Level level={s.level} />
            </li>
          ))}
        </ul>

        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          Achievements
        </p>
        <p className="text-zinc-400">Solved 500+ DSA problems · 15+ projects shipped</p>
      </div>

      <a
        href={RESUME.downloadHref}
        download
        className="flex items-center justify-center gap-2 rounded-md bg-sky-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500"
      >
        <Download size={16} /> Download Resume
      </a>
      <p className="text-center text-xs text-zinc-500">
        Format: PDF · Size: {RESUME.size}
      </p>
    </div>
  );
}
