import { Download } from "lucide-react";
import { RESUME, PREVIEW_SKILLS, PREVIEW_EDUCATION } from "@/data/resume";

/** Small uppercase section label used inside the resume "paper". */
function PaperLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-600/80 dark:text-sky-300/70">
      {children}
    </p>
  );
}

/** Five-dot level meter. */
function Level({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i < level ? "bg-sky-500 dark:bg-sky-400" : "bg-zinc-300 dark:bg-zinc-700"
          }`}
        />
      ))}
    </span>
  );
}

export function ResumePreview() {
  return (
    <div className="flex flex-col gap-4 lg:col-span-5">
      {/* Elegant "paper" CV card */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-xs leading-relaxed shadow-sm dark:border-white/[0.06] dark:bg-[#0b1322]">
        <div className="border-b border-zinc-200 pb-4 dark:border-white/[0.08]">
          <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            {RESUME.name}
          </h3>
          <p className="mt-0.5 text-sm text-sky-600 dark:text-sky-300">{RESUME.role}</p>
        </div>

        <div className="mt-4 space-y-4">
          <section>
            <PaperLabel>Profile</PaperLabel>
            <p className="text-zinc-600 dark:text-zinc-400">
              Software Engineer focused on building scalable, user-friendly applications.
            </p>
          </section>

          <section>
            <PaperLabel>Education</PaperLabel>
            <p className="font-medium text-zinc-800 dark:text-zinc-200">{PREVIEW_EDUCATION.degree}</p>
            <p className="text-zinc-500">
              {PREVIEW_EDUCATION.field} · {PREVIEW_EDUCATION.years}
            </p>
          </section>

          <section>
            <PaperLabel>Skills</PaperLabel>
            <ul className="flex flex-col gap-2">
              {PREVIEW_SKILLS.map((s) => (
                <li key={s.name} className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">{s.name}</span>
                  <Level level={s.level} />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <PaperLabel>Achievements</PaperLabel>
            <p className="text-zinc-600 dark:text-zinc-400">
              Solved 500+ DSA problems · 15+ projects shipped
            </p>
          </section>
        </div>
      </div>

      <a
        href={RESUME.downloadHref}
        download
        className="flex items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500"
      >
        <Download size={16} /> Download Resume
      </a>
      <p className="text-center text-xs text-zinc-500">
        Format: PDF · Size: {RESUME.size}
      </p>
    </div>
  );
}
