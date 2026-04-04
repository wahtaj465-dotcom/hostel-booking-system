export default function Button({
  as: Comp = "button",
  className = "",
  variant = "primary", // primary | outline | ghost | danger
  size = "md", // sm | md | lg
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-semibold transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  };

  const variants = {
    primary:
      "bg-violet-600 text-white shadow-[0_14px_40px_rgba(124,58,237,0.25)] hover:bg-violet-500",
    outline:
      "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
    danger:
      "bg-rose-600 text-white shadow-[0_14px_40px_rgba(244,63,94,0.18)] hover:bg-rose-500",
  };

  return (
    <Comp
      className={[base, sizes[size], variants[variant], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}