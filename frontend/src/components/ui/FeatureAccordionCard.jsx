import { useMemo, useState } from "react";

export default function FeatureAccordionCard({
  icon,
  title,
  summary = "",
  details,
  defaultOpen = false,
  maxContentHeight = 220,
}) {
  const [open, setOpen] = useState(defaultOpen);

  const wrapperStyle = useMemo(() => {
    return {
      maxHeight: open ? `${maxContentHeight + 28}px` : "0px",
      opacity: open ? 1 : 0,
      paddingBottom: open ? "16px" : "0px",
    };
  }, [open, maxContentHeight]);

  return (
    <div className="rounded-3xl border border-[#ff6f3d]/30 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,111,61,0.14),0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur transition hover:border-[#ff7a45]/45 hover:shadow-[0_0_0_1px_rgba(255,111,61,0.22),0_24px_64px_rgba(255,111,61,0.18)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full p-6 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#ff6f3d]/10 ring-1 ring-[#ff6f3d]/30">
              <span className="text-2xl">{icon}</span>
            </div>

            <div>
              <div className="text-xl font-extrabold text-white">{title}</div>
              {summary ? (
                <div className="mt-1 text-sm text-slate-400">{summary}</div>
              ) : null}
            </div>
          </div>

          <span
            className={[
              "grid h-10 w-10 place-items-center rounded-full bg-white/[0.04] ring-1 ring-white/15 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0",
            ].join(" ")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-slate-300"
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
        </div>
      </button>

      <div className="px-6">
        <div
          className="overflow-hidden transition-[max-height,opacity,padding] duration-300 ease-out"
          style={wrapperStyle}
        >
          <div
            className={[
              "pr-2 text-base leading-7 text-slate-400",
              open ? "overflow-y-auto" : "overflow-hidden",
            ].join(" ")}
            style={open ? { maxHeight: `${maxContentHeight}px` } : undefined}
          >
            {details}
          </div>
        </div>
      </div>
    </div>
  );
}