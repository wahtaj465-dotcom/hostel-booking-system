import { useMemo, useState } from "react";

export default function FaqAccordionItem({
  question,
  answer,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  const wrapperStyle = useMemo(() => {
    return {
      maxHeight: open ? "220px" : "0px",
      opacity: open ? 1 : 0,
      paddingTop: open ? "14px" : "0px",
    };
  }, [open]);

  return (
    <div
      className={[
        "rounded-3xl bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,111,61,0.12),0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur",
        "border transition",
        open
          ? "border-[#ff6f3d]/45"
          : "border-white/10 hover:border-[#ff6f3d]/35",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
        aria-expanded={open}
      >
        <div className="text-xl font-extrabold text-white">{question}</div>

        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.04] ring-1 ring-white/15">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className={[
              "text-slate-300 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0",
            ].join(" ")}
          >
            <path
              d="M6 14l6-6 6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div className="px-6">
        <div
          className="overflow-hidden transition-[max-height,opacity,padding-top] duration-300 ease-out"
          style={wrapperStyle}
        >
          <p className="pb-6 text-base leading-7 text-slate-400">{answer}</p>
        </div>
      </div>
    </div>
  );
}