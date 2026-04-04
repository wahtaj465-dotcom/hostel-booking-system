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
    <div className="rounded-3xl border border-violet-200/70 bg-white/80 shadow-[0_18px_50px_rgba(124,58,237,0.12)] backdrop-blur transition hover:shadow-[0_22px_60px_rgba(124,58,237,0.16)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full p-6 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-600/10 ring-1 ring-violet-500/15">
              <span className="text-2xl">{icon}</span>
            </div>

            <div>
              <div className="text-xl font-extrabold text-slate-900">
                {title}
              </div>
              {summary ? (
                <div className="mt-1 text-sm text-slate-600">{summary}</div>
              ) : null}
            </div>
          </div>

          <span
            className={[
              "grid h-10 w-10 place-items-center rounded-full bg-slate-50 ring-1 ring-slate-200 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0",
            ].join(" ")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-slate-600"
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
          {/* Only the OPEN card becomes scrollable */}
          <div
            className={[
              "pr-2 text-base leading-7 text-slate-600",
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