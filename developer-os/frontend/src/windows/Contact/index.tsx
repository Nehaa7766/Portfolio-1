"use client";

import { ContactInfo } from "./ContactInfo";
import { ContactForm } from "./ContactForm";
import { ConnectVia } from "./ConnectVia";

export default function ContactWindow() {
  return (
    <div className="h-full overflow-auto bg-[#060b16] p-5 font-mono text-zinc-300">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_0.8fr]">
        <ContactInfo />
        <ContactForm />
        <ConnectVia />
      </div>
    </div>
  );
}
