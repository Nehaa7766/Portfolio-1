import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, FileText } from "lucide-react";
import type { ChatMessage as Message } from "@/types/ai";
import { cn } from "@/lib/utils";

/** Markdown renderer styled for the dark assistant bubble. */
function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-white">{children}</strong>
        ),
        code: ({ children }) => (
          <code className="rounded bg-black/40 px-1 py-0.5 text-[0.85em] text-sky-300">
            {children}
          </code>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 underline"
          >
            {children}
          </a>
        ),
        h1: ({ children }) => <h3 className="mb-2 text-sm font-semibold text-white">{children}</h3>,
        h2: ({ children }) => <h3 className="mb-2 text-sm font-semibold text-white">{children}</h3>,
        h3: ({ children }) => <h4 className="mb-1 text-sm font-semibold text-white">{children}</h4>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-zinc-700 text-zinc-200" : "bg-sky-600 text-white",
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </span>

      <div className={cn("min-w-0 max-w-[80%]", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-sm bg-sky-600 text-white"
              : "rounded-tl-sm bg-zinc-800 text-zinc-200",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <Markdown content={message.content} />
          )}
        </div>

        {/* Sources (assistant only) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {message.sources.map((src) => (
              <span
                key={src}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400"
              >
                <FileText size={11} />
                {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
