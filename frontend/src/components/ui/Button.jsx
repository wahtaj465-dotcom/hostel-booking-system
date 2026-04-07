export default function Button({
  as: Comp = "button",
  className = "",
  variant = "primary", // primary | outline | ghost | danger
  size = "md", // sm | md | lg
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-semibold transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6f3d]/50 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  };

  const variants = {
    primary:
      "bg-[#ff6f3d] text-white shadow-[0_0_0_1px_rgba(255,111,61,0.35),0_14px_36px_rgba(255,111,61,0.28)] hover:bg-[#ff7a45]",
    outline:
      "border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07]",
    ghost: "text-slate-200 hover:bg-white/[0.06]",
    danger:
      "bg-rose-600 text-white shadow-[0_14px_40px_rgba(244,63,94,0.2)] hover:bg-rose-500",
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