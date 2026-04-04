export default function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900",
        "outline-none focus:ring-2 focus:ring-violet-400/40",
        "placeholder:text-slate-400",
        className,
      ].join(" ")}
      {...props}
    />
  );
}