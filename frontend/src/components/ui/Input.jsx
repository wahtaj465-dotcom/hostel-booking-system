export default function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white",
        "outline-none focus:border-[#ff6f3d]/60 focus:ring-2 focus:ring-[#ff6f3d]/20",
        "placeholder:text-slate-500",
        className,
      ].join(" ")}
      {...props}
    />
  );
}